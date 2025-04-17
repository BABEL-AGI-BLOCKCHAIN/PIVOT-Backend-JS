import prisma from "../utils/prisma.js";
import { safeDecimal } from "../utils/validateDecimal.js";

const invest = async (req, res) => {
    try {
        const { investor, topicId, amount, position, nonce, chainId, transactionHash, blockTimeStamp } = req.body;

        const topic = await prisma.createTopic.findUnique({
            where: { id: topicId },
        });

        if (!topic) {
            return res.status(400).json({ error: "Topic does not exist" });
        }

        const user = await prisma.user.upsert({
            where: { walletAddress: investor },
            update: {},
            create: { walletAddress: investor },
        });

        const decimalAmount = safeDecimal(amount);

        const investment = await prisma.invest.create({
            data: {
                user: { connect: { walletAddress: user.walletAddress } },
                topic: { connect: { id: topic.id } },
                amount: decimalAmount,
                position,
                nonce,
                transactionHash,
                chainId,
                blockTimeStamp,
            },
        });

        const _topic = await prisma.topic.findUnique({
            where: { id: topic.id },
        });
        const currentInvestment = safeDecimal(_topic.totalInvestment);
        const updatedInvestment = currentInvestment.plus(decimalAmount);

        if (!updatedInvestment.isFinite()) {
            return res.status(400).json({ error: "Resulting investment is invalid" });
        }

        const existingInvestment = await prisma.invest.findFirst({
            where: {
                user: { walletAddress: user.walletAddress },
                topic: { id: topic.id },
            },
        });

        await prisma.topic.update({
            where: { id: topic.id },
            data: {
                totalInvestment: updatedInvestment,
                currentPosition: {
                    increment: 1,
                },
                ...(!existingInvestment && {
                    investorCount: {
                        increment: 1,
                    },
                }),
            },
        });

        res.status(201).json({
            investment,
            message: "Investment created successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const getPositions = async (req, res) => {
    try {
        const id = req.query.id;
        const investor = req.query.investor;
        const topicId = String(id);

        const positions = await prisma.invest.findMany({
            where: {
                topicId,
                investor,
            },
            orderBy: {
                blockTimeStamp: "desc",
            },
        });

        const authorInvestment = await prisma.createTopic.findUnique({
            where: { id: topicId, promoterId: investor },
            select: {
                investment: true,
                promoterId: true,
                position: true,
            },
        });

        const authorCreatedTopic = await prisma.topic.findUnique({
            where: { id: topicId },
            select: {
                blockTimeStamp: true,
            },
        });

        res.status(200).json({
            positions: [
                ...positions.map((item) => ({ position: item.position, blockTimeStamp: item.blockTimeStamp })),
                ...(authorInvestment?.position ? [{ position: authorInvestment.position, blockTimeStamp: authorCreatedTopic.blockTimeStamp }] : []),
            ],
            // authorInvestment,
            message: "Positions retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

export { invest, getPositions };

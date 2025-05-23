import uploadOnPinata from "../utils/pinata.js";
import prisma from "../utils/prisma.js";
import { safeDecimal } from "../utils/validateDecimal.js";

const createTopic = async (req, res) => {
    try {
        const { topicId, promoter, investment, position, tokenAddress, nonce, chainId, transactionHash, blockTimeStamp } = req.body;

        const user = await prisma.user.upsert({
            where: { walletAddress: promoter },
            update: {},
            create: { walletAddress: promoter },
        });

        if (!user) {
            return res.status(400).json({ error: "Promoter does not exist" });
        }

        // const existingTopic = await prisma.topic.findUnique({
        //     where: { id: topicId },
        // });

        // if (existingTopic) {
        //     return res.status(200).json({
        //         message: "Topic already exists",
        //         topic: existingTopic,
        //     });
        // }

        const decimalInvestment = safeDecimal(investment);

        const result = await prisma.$transaction(async (tx) => {
            const newTopic = await tx.topic.upsert({
                where: { id: topicId },
                update: {
                    id: topicId,
                    totalInvestment: decimalInvestment,
                    currentPosition: position,
                    commentCount: 0,
                    investorCount: 1,
                    transactionHash,
                    chainId,
                    blockTimeStamp,
                },
                create: { id: topicId, totalInvestment: decimalInvestment, currentPosition: position, commentCount: 0, investorCount: 1, transactionHash, chainId, blockTimeStamp },
            });

            const newCreateTopic = await tx.createTopic.create({
                data: {
                    promoter: { connect: { walletAddress: user.walletAddress } },
                    investment: decimalInvestment,
                    position,
                    tokenAddress,
                    nonce,
                    topic: { connect: { id: topicId } },
                },
            });

            return { newTopic, newCreateTopic };
        });

        res.status(201).json({
            topic: result.newTopic,
            createTopic: result.newCreateTopic,
            message: "Topic created successfully",
        });
    } catch (error) {
        console.log(error.res || error.message);
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const comment = async (req, res) => {
    try {
        const { topicId, comment } = req.body;

        const topic = await prisma.topic.findUnique({
            where: { id: topicId },
        });

        if (!topic) {
            return res.status(400).json({ error: "Topic does not exist" });
        }

        const newComment = await prisma.comment.create({
            data: {
                author: { connect: { walletAddress: req.user.walletAddress } },
                topic: { connect: { id: topicId } },
                content: comment,
            },
        });

        await prisma.topic.update({
            where: { id: topicId },
            data: {
                commentCount: {
                    increment: 1,
                },
            },
        });

        res.status(201).json({
            comment: newComment,
            message: "Comment created successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const getTopics = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        let sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

        const allowedFields = ["blockTimeStamp", "totalInvestment", "commentCount", "investorCount"];
        if (!allowedFields.includes(sortField)) {
            sortField = "blockTimeStamp";
        }

        const topics = await prisma.topic.findMany({
            skip,
            take: limit,
            include: {
                createTopic: {
                    include: { promoter: true },
                },
                metadata: true,
            },
            orderBy: {
                [sortField]: sortOrder,
            },
        });

        const totalTopics = await prisma.topic.count();

        res.status(200).json({
            topics,
            pagination: {
                totalTopics,
                currentPage: page,
                totalPages: Math.ceil(totalTopics / limit),
            },
            message: "Topics retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const getComments = async (req, res) => {
    try {
        const topicId = req.params.topicId;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const comments = await prisma.comment.findMany({
            where: { topicId },
            include: { author: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        const totalComments = await prisma.comment.count({
            where: { topicId },
        });

        res.status(200).json({
            comments,
            pagination: {
                totalComments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
            },
            message: "Comments retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.response || error.message || "Internal server error",
        });
    }
};

const getTopicsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const topics = await prisma.topic.findMany({
            where: {
                createTopic: {
                    promoterId: userId,
                },
            },
            include: {
                createTopic: true,
                metadata: true,
            },
            orderBy: {
                createTopic: {
                    createdAt: "asc",
                },
            },
            skip,
            take: limit,
        });

        const totalTopics = await prisma.topic.count({
            where: {
                createTopic: {
                    promoterId: userId,
                },
            },
        });

        res.status(200).json({
            topics,
            pagination: {
                totalTopics,
                currentPage: page,
                totalPages: Math.ceil(totalTopics / limit),
            },
            message: "Topics retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const getTopicById = async (req, res) => {
    try {
        const id = req.params.id;
        const topic = await prisma.topic.findUnique({
            where: { id },
            include: {
                createTopic: {
                    include: { promoter: true },
                },
                metadata: true,
            },
        });

        if (!topic) {
            throw new Error("Topic not found");
        }

        res.status(200).json({
            topic,
            message: "Topic retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const updateTopic = async (req, res) => {
    try {
        const { topicId, topicTitle, topicContent, topicHash } = req.body;

        const imageLocalPath = req.files?.image?.[0]?.path;

        let mediaCID = null;
        if (imageLocalPath) {
            const uploadedImage = await uploadOnPinata(imageLocalPath);
            mediaCID = uploadedImage;
        }

        // const existingTopic = await prisma.topic.findUnique({
        //     where: { id: topicId },
        // });

        // if (!existingTopic) {
        //     return res.status(404).json({ error: "Topic not found" });
        // }

        const metadata = await prisma.metadata.upsert({
            where: { topicId },
            update: {
                topicTitle,
                topicContent,
                topicHash,
                mediaCID,
            },
            create: {
                topicTitle,
                topicContent,
                topicHash,
                mediaCID,
                topic: {
                    connectOrCreate: {
                        where: { id: topicId },
                        create: { id: topicId, currentPosition: 0, investorCount: 0, commentCount: 0, blockTimeStamp: new Date(), transactionHash: "", chainId: "" },
                    },
                },
            },
        });

        await new Promise(async (resolve) => {
            setInterval(async () => {
                const existingTopic = await prisma.topic.findUnique({
                    where: { id: topicId },
                });

                if (existingTopic.transactionHash) {
                    resolve();
                }
            }, 3000);
        });

        res.status(201).json({
            metadata,
            message: "Metadata updated successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

export { getTopics, getTopicsByUser, getTopicById, createTopic, updateTopic, getComments, comment };

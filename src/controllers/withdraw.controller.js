import prisma from "../utils/prisma.js";
import {safeDecimal} from "../utils/validateDecimal.js";

const withdraw = async (req, res) => {
    try {
        const { to, amount, nonce, chainId, transactionHash, blockTimeStamp } = req.body;
        
        const user = await prisma.user.upsert({
            where: { walletAddress: to },
            update: {},
            create: {
                walletAddress: to,
            },
        });

        const withdraw = await prisma.withdraw.create({
            data: {
                walletAddress: user.walletAddress,
                amount: safeDecimal(amount),
                nonce: nonce,
                chainId: chainId,
                transactionHash: transactionHash,
                blockTimeStamp: blockTimeStamp,
            },
        });
        res.status(200).json(withdraw);
        console.log("Withdraw created:", withdraw);
        
    } catch (error) {
        console.error("Error in withdraw controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default withdraw;
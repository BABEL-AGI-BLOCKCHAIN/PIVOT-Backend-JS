import prisma from "../utils/prisma.js";

const getUserByWalletAddress = async (req, res) => {
    try {
        const walletAddress = req.params.walletAddress;
        const user = await prisma.user.findUnique({
            where: { walletAddress },
        });

        if (!user) {
            throw new Error("User not found");
        }

        res.status(200).json({
            user,
            message: "User retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

export { getUserByWalletAddress };

import prisma from "../utils/prisma.js";
import { verifyMessage } from "ethers";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const signIn = async (req, res) => {
    try {
        console.log(req.body);
        const { walletAddress, signature, message } = req.body;
        const recoveredAddress = verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            res.status(401).json({
                error: "Unauthorized access",
            });
        }

        let user = await prisma.user.findUnique({ where: { walletAddress } });

        if (!user) {
            user = await prisma.user.create({ data: { walletAddress } });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

export default signIn;

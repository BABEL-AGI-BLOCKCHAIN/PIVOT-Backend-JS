import prisma from "../utils/prisma.js";
import { verifyMessage } from "ethers";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const signIn = async (req, res) => {
    try {

        const { walletAddress, signature, message } = req.body;
        const recoveredAddress = verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          throw new apiError (401, "Unauthorized access");
        }
  
        let user = await prisma.user.findUnique({ where: { walletAddress } });
  
        if (!user) {
          user = await prisma.user.create({ data: { walletAddress } });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        return res.status(200).json(
            {
                accessToken,
                refreshToken
            },
            "signIn successful"
        )
    } catch (error) {
        console.error(error.message);
        res.status(500).
        json({
            error: error.message || "Internal server error" 
        });
        
    }
}

const twitterSuccess = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Twitter authentication successful',
        user: req.user,
    });
};
  
const twitterFailure = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Twitter authentication failed',
    });
};
  

export { signIn, twitterSuccess, twitterFailure };
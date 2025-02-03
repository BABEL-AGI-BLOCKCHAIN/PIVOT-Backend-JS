import { verifyMessage } from "ethers";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma.js";
import apiResponse from "../../../utils/apiResponse.js";
import apiError from "../../../utils/apiError.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { walletAddress, signature, message } = req.body;
    console.log (walletAddress, signature, message);
    try {
      const recoveredAddress = verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new apiError (401, "Unauthorized access");
      }

      let user = await prisma.user.findUnique({ where: { walletAddress } });

      if (!user) {
        user = await prisma.user.create({ data: { walletAddress } });
      }

      const token = jwt.sign(
        { 
          userId: user.id 
        }, process.env.JWT_SECRET, 
        { 
          expiresIn: process.env.TOKEN_EXPIRY 
        }
      );
      
      return res.status(200).json(
        new apiResponse (
          200,
          {token: token},
          "Login successful"
        )
      );
    } catch (err) {
      console.log (err.message)
      return res.status(500).json(
        new apiError(
          500,
          err.message,
        )
      )
    }
  } else {
      return res.status(405).json(
        new apiError(
          405,
          "Method not allowed"
        )
      )
  }
}

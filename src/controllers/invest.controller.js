import prisma from "../utils/prisma.js";
import {safeDecimal} from "../utils/validateDecimal.js";

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
  
      const currentInvestment = safeDecimal(topic.investment);
      const updatedInvestment = currentInvestment.plus(decimalAmount);
  
      if (!updatedInvestment.isFinite()) {
        return res.status(400).json({ error: "Resulting investment is invalid" });
      }
  
      await prisma.topic.update({
        where: { id: topic.id },
        data: {
          totalInvestment: updatedInvestment,
          currentPosition: {
            increment: 1,
          },
          investorCount: {
            increment: 1,
          },
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
      const { topicId, investor} = req.body;
      const id = String(topicId);
      const positions = await prisma.invest.findMany({
        where: { 
          topicId: id, 
          investor 
        },
      });
  
      res.status(200).json({
        positions,
        message: "Positions retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message || "Internal server error",
      });
    }
}
  
export { invest, getPositions };
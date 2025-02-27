import prisma from "../utils/prisma.js";


const createTopic = async (req, res) => {
    try {
      const { topicId, promoter, investment, position, tokenAddress, nonce, chainId, transactionHash } = req.body;
  
      const user = await prisma.user.upsert({
        where: { walletAddress: promoter },
        update: {},
        create: { walletAddress: promoter },
      });
  
      if (!user) {
        return res.status(400).json({ error: "Promoter does not exist" });
      }
  
      const existingTopic = await prisma.createTopic.findUnique({
        where: { id: topicId },
      });
  
      if (existingTopic) {
        return res.status(200).json({
          message: "Topic already exists",
          topic: existingTopic,
        });
      }
  
      const newTopic = await prisma.createTopic.create({
        data: {
          id: topicId,
          promoter: { connect: { id: user.id } },
          investment: BigInt(investment),
          position,
          tokenAddress,
          nonce,
          transactionHash,
          chainId,
        },
      });
  
      res.status(201).json({
        newTopic,
        message: "Topic created successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message || "Internal server error",
      });
    }
};
  
const getTopics = async (_, res) => {
    try {

        const newTopics = await prisma.createTopic.findMany({
            orderBy: {
              createdAt: 'asc',
            },
        });

        res.status(200).json({
            newTopics,
            message: "Topics retrieved successfully",
        });

    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
}

const getTopicsByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const newTopics = await prisma.createTopic.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        res.status(200).json({
            newTopics,
            message: "Topics retrieved successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
}

const getTopicById = async (req, res) => {
    try {
        const topicId = parseInt(req.params.topicId);
        const newTopic = await prisma.createTopic.findOne({
            where: {
                id: topicId,
            },
        });
        
        if (!newTopic) {
            throw new Error("Topic not found");
        }
        
        res.status(200).json({
            newTopic,
            message: "Topic retrieved successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
}

const invest = async (req, res) => {
  const {investor, topicId, amount, position, nonce, chainId, transactionHash} = req.body;

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

  const investment = await prisma.invest.create({
    data: {
      investor: { connect: { id: user.id } },
      topicId: { connect: { id: topic.id } },
      amount: BigInt(amount),
      position,
      nonce,
      transactionHash,
      chainId,
    },
  });

  await prisma.createTopic.update({
    where: { id: topic.id },
    data: {
      investment: BigInt(topic.investment) + BigInt(amount),
    },
  });

  res.status(201).json({
    investment,
    message: "Investment created successfully",
  });

}

export  {getTopics, getTopicsByUser, getTopicById, createTopic, invest};
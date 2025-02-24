import prisma from "../utils/prisma.js";


const createTopic = async (req, res) => {
    try {
        const { topicId, promoter, investment, position, tokenAddress, nonce } = req.body;

        const user = await prisma.user.upsert({
            where: { walletAddress: promoter },
            update: {},
            create: { walletAddress: promoter },
        });

        if (!user) {
            return res.status(400).json({ error: "Promoter does not exist" });
        }

        const existingTopic = await prisma.topic.findUnique({
            where: { id: topicId },
          });
      
          if (existingTopic) {
            return res.status(200).json({
              message: "Topic already exists",
              topic: existingTopic,
            });
          }

        const newTopic = await prisma.topic.create({
            data: {
                id: topicId,
                promoter: { connect: { id: user.id } },
                investment,
                position,
                tokenAddress,
                nonce,
            },
        });

        res.status(201).json({
            newTopic,
            message: "Topic created successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.response.data || "Internal server error",
        });
    }
};

const getTopics = async (_, res) => {
    try {

        const newTopics = await prisma.topic.findMany({
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
        const newTopics = await prisma.topic.findMany({
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
        const newTopic = await prisma.topic.findOne({
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


export  {getTopics, getTopicsByUser, getTopicById, createTopic};
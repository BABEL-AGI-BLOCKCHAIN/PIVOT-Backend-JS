import prisma from "../utils/prisma.js";
import {contract, provider} from "../utils/provider.js";
import axios from "axios";

const MAX_BLOCK_RANGE = 50000;
const baseURL = process.env.BASE_URL || "http://localhost:5000";

const createTopic = async (req, res) => {
    try {
        const { topicId, promoter, investment, position, tokenAddress, nonce } = req.body;

        const user = await prisma.user.findUnique({
            where: { walletAddress: promoter },
        });

        if (!user) {
            return res.status(400).json({ error: "Promoter does not exist" });
        }

        const newTopic = await prisma.topic.create({
            data: {
                topic_id: topicId,
                promoter: { connect: { id: user.id } }, // Fixed: using nested connect
                Investment: parseInt(investment),
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
        console.error("Error creating topic:", error.message);
        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
};

const getTopics = async (_, res) => {
    try {

        // await axios.get(`${baseURL}/api/v1/topic/historic?eventName=CreateTopic`);

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

const getHistoricTopics = async (req, res) => {
    const { eventName } = req.query;
  
    if (!eventName) {
      return res.status(400).json({ error: "The 'eventName' query parameter is required." });
    }
  
    try {
      const getResponse = await axios.get(`${baseURL}/api/v1/event/getEventSync?eventName=${eventName}`);
      const lastBlock = getResponse.data.lastBlock;
  
      const currentBlock = await provider.getBlockNumber();
      let fromBlock = lastBlock + 1;
      let toBlock = currentBlock;
  
      console.log(`Fetching ${eventName} events from block ${fromBlock} to ${toBlock}`);
  
      while (fromBlock <= toBlock) {
        const endBlock = Math.min(fromBlock + MAX_BLOCK_RANGE - 1, toBlock);
        console.log(`Fetching events from block ${fromBlock} to ${endBlock}`);
  
        const filter = contract.filters[eventName]();
        const events = await contract.queryFilter(filter, fromBlock, endBlock);
        console.log(`Found ${events.length} ${eventName} events from block ${fromBlock} to ${endBlock}.`);
  
        for (const event of events) {
          const { promoter, topicId, investment, position, tokenAddress, nonce } = event.args;
  
          try {
            await axios.post(`${baseURL}/api/events/topicCreate`, {
              promoter,
              topicId: topicId.toString(),
              investment: investment.toString(),
              position: parseInt(position),
              tokenAddress,
              nonce: nonce.toString(),
            });
          } catch (error) {
            console.error(`Error processing event:`, error);
          }
        }
  
        fromBlock = endBlock + 1;
      }
  
      return res.status(200).json({ message: "Historic events processed successfully." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};


export  {getTopics, getTopicsByUser, getTopicById, createTopic, getHistoricTopics};
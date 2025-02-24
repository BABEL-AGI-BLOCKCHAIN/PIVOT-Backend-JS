import axios from "axios";
import { provider, contract } from "../utils/provider.js";

const MAX_BLOCK_RANGE = 50000;
const baseURL = process.env.BASE_URL || "http://localhost:5000";

async function processHistoricTopics(eventName) {
    try {
        const getResponse = await axios.get(`${baseURL}/api/v1/event/getEventSync?eventName=${eventName}`);
        const lastBlock = getResponse.data.lastBlock;

        const currentBlock = await provider.getBlockNumber();

        console.log (currentBlock) ;
        let fromBlock = lastBlock + 1;
        const toBlock = currentBlock;

        console.log(`Fetching ${eventName} events from block ${fromBlock} to ${toBlock}`);

        while (fromBlock <= toBlock) {
            const endBlock = Math.min(fromBlock + MAX_BLOCK_RANGE - 1, toBlock);

            const filter = contract.filters[eventName](null, null, null, null, null, null);
            const events = await contract.queryFilter(filter, fromBlock, endBlock);
            if (events.length) {
                console.log(`Found ${events.length} ${eventName} events from block ${fromBlock} to ${endBlock}.`);
            }

            for (const event of events) {
                const { promoter, topicId, investment, position, tokenAddress, nonce } = event.args;

                try {
                    const isTopic = await axios.post(`${baseURL}/api/v1/topic/createTopic`, {
                        promoter, 
                        topicId: topicId.toString(),
                        investment: Number(investment), 
                        position: Number(position),   
                        tokenAddress,
                        nonce: nonce.toString(), 
                    });

                    if (isTopic.status == 200) {
                        console.log("Topic already exists");
                    }
                    else if (isTopic.status == 201) {
                        console.log("Topic created successfully");
                    }
                    
                } catch (error) {
                    console.error(`Error processing event:`, error.response.data);
                }
            }

            try {
                await axios.post(`${baseURL}/api/v1/event/updateEventSync?eventName=${eventName}`, {
                    blockNumber: endBlock,
                });
            } catch (error) {
                console.error("Error updating event sync:", error);
            }

            fromBlock = endBlock + 1;
        }
    } catch (error) {
        console.error("Error processing historic topics:", error.message);
    }
}

export default processHistoricTopics;

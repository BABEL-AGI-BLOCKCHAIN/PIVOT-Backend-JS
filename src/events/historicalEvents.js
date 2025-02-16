import { contract, provider } from '../lib/provider.js';
import { handleCreateTopic } from '../controllers/topicController.js';

const fetchHistoricalTopics = async () => {
  try {
    const eventName = "CreateTopic";

    const getResponse = await fetch(`/api/events/eventSync?eventName=${eventName}`);
    if (!getResponse.ok) {
      throw new Error(`Failed to get last processed block: ${getResponse.statusText}`);
    }
    const getData = await getResponse.json();
    const lastBlock = getData.lastBlock;

    const currentBlock = await provider.getBlockNumber();

    const fromBlock = lastBlock + 1;
    const toBlock = currentBlock;

    console.log(`Fetching CreateTopic events from block ${fromBlock} to ${toBlock}`);

    const filter = contract.filters.CreateTopic();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    console.log(`Found ${events.length} CreateTopic events.`);


    for (const event of events) {
      const { amount, topicHash, erc20Address } = event.args;
      
      if (!topicHash) {
        console.error(`Event at block ${event.blockNumber} is missing topicHash. Skipping event.`);
        continue;
      }
      
      let topicData;
      try {
        topicData = JSON.parse(topicHash);
      } catch (parseError) {
        console.error(`Error parsing topicHash JSON at block ${event.blockNumber}:`, parseError);
        continue;
      }

      try {
        await handleCreateTopic({
          amount,
          topicData,
          erc20Address,
        });
        console.log(`Processed topic with ID ${topicData.topic_id} from block ${event.blockNumber}.`);
      } catch (dbError) {
        console.error(`Error processing topic from block ${event.blockNumber}:`, dbError);
      }
    }

    const postResponse = await fetch(`/api/events/eventSync?eventName=${eventName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockNumber: toBlock }),
    });
    if (!postResponse.ok) {
      throw new Error(`Failed to update last processed block: ${postResponse.statusText}`);
    }
    const postData = await postResponse.json();
    console.log(`Updated last processed block to ${postData.updatedBlockNumber}`);

  } catch (error) {
    console.error("Error fetching historical CreateTopic events:", error);
    throw error;
  }
};

export default fetchHistoricalTopics;

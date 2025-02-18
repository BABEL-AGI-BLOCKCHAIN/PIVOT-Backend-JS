import { contract, provider } from '../lib/provider.js';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const MAX_BLOCK_RANGE = 50000;

const fetchHistoricalTopics = async () => {
  try {
    const eventName = "CreateTopic";

    const getResponse = await fetch(`${baseURL}/api/events/eventSync?eventName=${eventName}`);
    if (!getResponse.ok) {
      throw new Error(`Failed to get last processed block: ${getResponse.statusText}`);
    }
    const getData = await getResponse.json();
    const lastBlock = getData.lastBlock;

    const currentBlock = await provider.getBlockNumber();
    let fromBlock = lastBlock + 1;
    let toBlock = currentBlock;

    console.log(`Fetching CreateTopic events from block ${fromBlock} to ${toBlock}`);

    while (fromBlock <= toBlock) {
      const endBlock = Math.min(fromBlock + MAX_BLOCK_RANGE - 1, toBlock);
      console.log(`Fetching events from block ${fromBlock} to ${endBlock}`);

      const filter = contract.filters.CreateTopic();
      const events = await contract.queryFilter(filter, fromBlock, endBlock);
      console.log(`Found ${events.length} CreateTopic events from block ${fromBlock} to ${endBlock}.`);

      for (const event of events) {
        const { promoter, topicId, investment, position, tokenAddress, nonce } = event.args;

        try {
          const response = await fetch(`${baseURL}/api/events/topicCreate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              promoter,
              topicId: topicId.toString(),
              investment: investment.toString(),
              position: parseInt(position),
              tokenAddress,
              nonce: nonce.toString(),
            })
          });

          if (!response.ok) {
            console.error(
              `Failed to create topic for topicId ${topicId.toString()} at block ${event.blockNumber}: ${response.statusText}`
            );
          } else {
            const data = await response.json();
            console.log(
              `Processed topic with contractTopicId ${data.topic.contractTopicId} from block ${event.blockNumber}.`
            );
          }
        } catch (apiError) {
          console.error(`Error processing topic from block ${event.blockNumber}:`, apiError);
        }
      }

      // Update last processed block after processing each batch
      const postResponse = await fetch(`${baseURL}/api/events/eventSync?eventName=${eventName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockNumber: endBlock }),
      });
      if (!postResponse.ok) {
        throw new Error(`Failed to update last processed block: ${postResponse.statusText}`);
      }
      const postData = await postResponse.json();
      console.log(`Updated last processed block to ${postData.updatedBlockNumber}`);

      // Move to the next batch
      fromBlock = endBlock + 1;
    }
  } catch (error) {
    console.error("Error fetching historical CreateTopic events:", error);
    throw error;
  }
};

export default fetchHistoricalTopics;

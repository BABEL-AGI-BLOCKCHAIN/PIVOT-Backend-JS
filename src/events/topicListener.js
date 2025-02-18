import { contract } from '../lib/provider.js';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const listenToCreateTopic = () => {
  contract.on('CreateTopic', async (promoter, topicId, investment, position, tokenAddress, nonce) => {
    try {
      const payload = {
        promoter,
        topicId: topicId.toString(),
        investment: investment.toString(),
        position: parseInt(position),
        tokenAddress,
        nonce: nonce.toString(),
      };

      const response = await fetch(`${baseURL}/api/events/topicCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Failed to process CreateTopic event: ${response.statusText}`);
      } else {
        const data = await response.json();
        console.log('Successfully processed CreateTopic event:', data);
      }
    } catch (error) {
      console.error('Error handling CreateTopic event:', error);
    }
  });
};

export default listenToCreateTopic;

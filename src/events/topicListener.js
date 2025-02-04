import { contract } from '../lib/provider.js';
import { handleCreateTopic } from '../controllers/topicController.js';

const listenToCreateTopic = () => {
  contract.on('CreateTopic', async (amount, topicHash, erc20Address) => {
    try {
      const topicData = JSON.parse(topicHash);

      await handleCreateTopic({ 
        amount, 
        topicData,
        erc20Address 
      });
    } catch (error) {
      console.error('Error handling CreateTopic event:', error);
    }
  });
};

export default listenToCreateTopic;

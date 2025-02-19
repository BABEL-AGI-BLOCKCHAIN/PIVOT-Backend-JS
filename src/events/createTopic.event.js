import { contract } from '../utils/provider.js';
import {createTopic} from '../controllers/topic.controller.js';

const listenToCreateTopic = () => {
  contract.on('CreateTopic', async (promoter, topicId, investment, position, tokenAddress, nonce) => {
    try {

      await createTopic({ 
        promoter,
        topicId: topicId.toString(),
        investment: investment.toString(),
        position: parseInt(position),
        tokenAddress,
        nonce: nonce.toString(), 
      });
    } catch (error) {
      console.error('Error handling CreateTopic event:', error);
    }
  });
};

export default listenToCreateTopic;
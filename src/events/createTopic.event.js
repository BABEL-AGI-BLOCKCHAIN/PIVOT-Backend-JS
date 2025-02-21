import { contract } from '../utils/provider.js';
import axios from 'axios';

const baseURL = process.env.base_url || 'http://localhost:5000';

const listenToCreateTopic = () => {
  contract.on('CreateTopic', async (promoter, topicId, investment, position, tokenAddress, nonce) => {
    try {
      
      const response = await axios.post(`${baseURL}/api/v1/topic/createTopic`, {
        promoter, 
        topicId: topicId.toString(),
        investment: Number(investment), 
        position: Number(position),   
        tokenAddress,
        nonce: nonce.toString(), 
      });

      console.log('Topic created successfully:', response.data);
    } catch (error) {
      console.error('Error handling CreateTopic event:', error.message);
    }
  });
};

export default listenToCreateTopic;
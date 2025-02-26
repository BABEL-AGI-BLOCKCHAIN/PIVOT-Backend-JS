import { contract, provider } from '../utils/provider.js';
import axios from 'axios';

const baseURL = process.env.base_url || 'http://localhost:5000';

const listenToCreateTopic = async () => {
  contract.on('CreateTopic', async (promoter, topicId, investment, position, tokenAddress, nonce) => {
    try {
      const { chainId } = await provider.getNetwork();

      await axios.post(`${baseURL}/api/v1/topic/createTopic`, {
        promoter,
        topicId: topicId.toString(),
        investment: BigInt(investment),
        position: Number(position),
        tokenAddress,
        nonce: nonce.toString(),
        chainId: chainId.toString(),
      });
    } catch (error) {
      console.error(
        'Error handling CreateTopic event:',
        error.response ? error.response.data : error.message
      );
    }
  });
};

export default listenToCreateTopic;

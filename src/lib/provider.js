import { WebSocketProvider, Contract  } from 'ethers';
import pivotTopicAbi from '../utils/PivotTopic.json';

const provider = new WebSocketProvider(process.env.NEXT_PUBLIC_RPC_URL);
const contractAddress = process.env.NEXT_PUBLIC_EVENT_TOPIC;
const abi = pivotTopicAbi;

const contract = new Contract(contractAddress, abi, provider);

export { provider, contract };

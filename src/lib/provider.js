import { JsonRpcProvider, Contract  } from 'ethers';
import pivotTopicAbi from '../utils/PivotTopic.json';

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const contractAddress = process.env.NEXT_PUBLIC_EVENT_TOPIC;
const abi = pivotTopicAbi.abi;

const contract = new Contract(contractAddress, abi, provider);

export { provider, contract };

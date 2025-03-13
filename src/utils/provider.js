import { WebSocketProvider, Contract  } from 'ethers';
import pivotTopicAbi from './pivotTopic.json' with { type: "json" }; 
import { configDotenv } from 'dotenv';

configDotenv()

const provider = new WebSocketProvider(process.env.RPC_URL);
const contractAddress = process.env.PIVOT_CONTRACT_ADDRESS;
const abi = pivotTopicAbi;

const contract = new Contract(contractAddress, abi, provider);

export { provider, contract };
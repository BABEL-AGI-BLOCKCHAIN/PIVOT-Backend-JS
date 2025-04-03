import {contract, provider} from '../utils/provider.js';
import axios from 'axios';
import {safeDecimal} from '../utils/validateDecimal.js';

const baseURL = 'http://localhost:5000' || process.env.BASE_URL;

const listenToWithdraw = async () => {
    contract.on("Withdraw", async (to, amount, nonce, event) => {
        try {
            const transactionHash = await event.log.transactionHash;
            const { chainId } = await provider.getNetwork();
            const decimalAmount = safeDecimal(amount);
            const block = await provider.getBlock(event.blockNumber);
            
            const blockTimeStamp = new Date(block.timestamp * 1000);

            console.log(
                `Withdraw event detected: 
                to: ${to}, 
                amount: ${decimalAmount}, 
                nonce: ${nonce}, 
                transactionHash: ${transactionHash}, 
                chainId: ${chainId}, 
                blockTimeStamp: ${blockTimeStamp}`
            )

            await axios.post(`${baseURL}/api/v1/withdraw/withdraw`, {
                to,
                amount: decimalAmount,
                nonce: nonce.toString(),
                transactionHash,
                chainId,
                blockTimeStamp
            }, {
                headers: {
                    'internal-secret': process.env.INTERNAL_SECRET,
                }
            });

        } catch (error) {
            console.error("Error in Withdraw event:", 
                error.response ? error.response.data : error.message
            );
        }
    })
}

export default listenToWithdraw;
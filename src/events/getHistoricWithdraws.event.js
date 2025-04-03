import axios from "axios";
import { provider, contract } from "../utils/provider.js";
import { safeDecimal } from "../utils/validateDecimal.js";

const MAX_BLOCK_RANGE = 50000;
const baseURL = process.env.BASE_URL || "http://localhost:5000";

async function processHistoricWithdrawEvents() {
  const eventName = "Withdraw";
  try {
    const getResponse = await axios.get(`${baseURL}/api/v1/event/getEventSync?eventName=${eventName}`, {
      headers: {
          'internal-secret': process.env.INTERNAL_SECRET,
      }
  });
    const lastBlock = getResponse.data.lastBlock;
    
    const currentBlock = await provider.getBlockNumber();
    
    let fromBlock = BigInt(lastBlock) + 1n;
    const toBlock = BigInt(currentBlock);
    
    while (fromBlock <= toBlock) {
      console.log(`Processing blocks from ${fromBlock} to ${toBlock}`);
      const blockRange = BigInt(MAX_BLOCK_RANGE);
      const candidate = fromBlock + blockRange - 1n;
      const endBlock = candidate < toBlock ? candidate : toBlock;
      
      const filter = contract.filters[eventName](null, null, null);
      const events = await contract.queryFilter(filter, fromBlock, endBlock);
      
      for (const e of events) {
        const { to, amount, nonce } = e.args;
        try {
          const { chainId } = await provider.getNetwork();
          const transactionHash = e.transactionHash || e.log.transactionHash;
          const decimalAmount = safeDecimal(amount);
          const block = await provider.getBlock(e.blockNumber);
      
          const blockTimeStamp = new Date(block.timestamp * 1000);
          
          await axios.post(`${baseURL}/api/v1/withdraw/withdraw`, {
            to,
            amount: decimalAmount,
            nonce: nonce.toString(),
            transactionHash,
            chainId: chainId.toString(),
            blockTimeStamp,
          }, {
            headers: {
                'internal-secret': process.env.INTERNAL_SECRET,
            }
        });
        } catch (error) {
          console.error(
            "Error processing withdraw event:",
            error.response ? error.response.data : error.message
          );
        }
      }
      
      try {
        await axios.post(`${baseURL}/api/v1/event/updateEventSync?eventName=${eventName}`, {
          blockNumber: BigInt(endBlock),
        }, {
          headers: {
              'internal-secret': process.env.INTERNAL_SECRET,
          }
      });
      } catch (error) {
        console.error(
          "Error updating event sync:",
          error.response ? error.response.data : error.message
        );
      }
      
      fromBlock = BigInt(endBlock) + 1n;
    }
  } catch (error) {
    console.error(
      "Error processing historic withdraw events:",
      error.response ? error.response.data : error.message
    );
  }
}

export default processHistoricWithdrawEvents;

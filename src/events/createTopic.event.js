import { contract, provider } from "../utils/provider.js";
import axios from "axios";
import { safeDecimal } from "../utils/validateDecimal.js";

const baseURL = process.env.BASE_URL || "http://localhost:5000";

const listenToCreateTopic = async () => {
    contract.on("CreateTopic", async (promoter, topicId, investment, position, tokenAddress, nonce, event) => {
        try {
            const { chainId } = await provider.getNetwork();
            const transactionHash = await event.log.transactionHash;
            const decimalInvestment = safeDecimal(investment);
            const block = await provider.getBlock(event.blockNumber);

            const blockTimeStamp = new Date(block.timestamp * 1000);

            await axios.post(
                `${baseURL}/api/v1/topic/createTopic`,
                {
                    promoter,
                    topicId: topicId.toString(),
                    investment: decimalInvestment,
                    position: Number(position),
                    tokenAddress,
                    nonce: nonce.toString(),
                    transactionHash,
                    chainId: chainId.toString(),
                    blockTimeStamp,
                },
                {
                    headers: {
                        "internal-secret": process.env.INTERNAL_SECRET,
                    },
                }
            );
        } catch (error) {
            console.error("Error handling CreateTopic event:", error.response ? error.response.data : error.message);
        }
    });
};

export default listenToCreateTopic;

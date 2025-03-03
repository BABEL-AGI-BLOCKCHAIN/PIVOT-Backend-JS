import { contract, provider } from '../utils/provider.js'

const listenToInvest = async () => {
    contract.on ('Invest', async (investor, topicId, amount, position, nonce, event) => {
        try {
            console.log (investor, topicId, amount, position, nonce);
            const transactionHash = await event.log.transactionHash;
            const { chainId } = await provider.getNetwork();
            await axios.post(`${baseURL}/api/v1/topic/invest`, {
                investor,
                topicId: topicId.toString(),
                amount: BigInt(amount),
                position: Number(position),
                nonce: nonce.toString(),
                transactionHash,
                chainId: chainId.toString(),
            });
        } catch (error) {
            console.error(
                'Error handling Invest event:',
                error.response ? error.response.data : error.message
            );
        }
    });
}

export default listenToInvest;
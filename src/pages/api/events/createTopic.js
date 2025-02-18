import prisma from '../../../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { promoter, topicId, investment, position, tokenAddress, nonce } = req.body;

  try {
    const topic = await prisma.topic.create({
      data: {
        promoter: promoter,
        contractTopicId: topicId.toString(),
        investment: BigInt(investment),
        position: position,
        tokenAddress: tokenAddress,
        nonce: BigInt(nonce),
        topic_id: topicId.toString(),
        totalInvestment: parseInt(investment),
        
      }
    });

    return res.status(201).json({ success: true, topic });
  } catch (error) {
    console.error('Error creating topic:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

import fetchHistoricalTopics from '../../../events/historicalEvents.js';
import prisma from '../../../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  
  try {
    await fetchHistoricalTopics();
    
    const newTopics = await prisma.topic.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    res.status(200).json({
      message: "topics fetched and processed.",
      newTopics,
    });
  } catch (error) {
    console.error("Error in topics API:", error);
    res.status(500).json({ error: error.message });
  }
}

import prisma from '../../../lib/prisma.js';

export default async function handler(req, res) {
  const { method, query, body } = req;
  const { eventName } = query;

  if (!eventName) {
    res.status(400).json({ error: "The 'eventName' query parameter is required." });
    return;
  }

  try {
    switch (method) {
      case "GET": {
        let record = await prisma.eventSync.findUnique({
          where: { eventName }
        });
        if (!record) {
          record = await prisma.eventSync.create({
            data: { eventName, lastBlock: 0 }
          });
        }
        res.status(200).json({ eventName, lastBlock: record.lastBlock });
        break;
      }
      case "POST": {
        const { blockNumber } = body;
        if (typeof blockNumber !== "number") {
          res.status(400).json({ error: "The 'blockNumber' field is required and must be a number." });
          return;
        }
        const updatedRecord = await prisma.eventSync.upsert({
          where: { eventName },
          update: { lastBlock: blockNumber },
          create: { eventName, lastBlock: blockNumber }
        });
        res.status(200).json({ eventName, updatedBlockNumber: updatedRecord.lastBlock });
        break;
      }
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error("Error in eventSync API:", error);
    res.status(500).json({ error: error.message });
  }
}

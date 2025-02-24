import prisma from '../utils/prisma.js';

const getEventSync = async (req, res) => {
  const { eventName } = req.query;

  if (!eventName) {
    return res.status(400).json({ error: "The 'eventName' query parameter is required." });
  }

  try {
    let record = await prisma.eventSync.findUnique({
      where: { eventName },
    });

    if (!record) {
      record = await prisma.eventSync.create({
        data: { eventName, lastBlock: 0 },
      });
    }

    return res.status(200).json({ eventName, lastBlock: record.lastBlock });
  } catch (error) {
    return res.status(500).json({ error: error.response.data });
  }
};

const updateEventSync = async (req, res) => {
  const { eventName } = req.query;
  const { blockNumber } = req.body;

  if (!eventName) {
    return res.status(400).json({ error: "The 'eventName' query parameter is required." });
  }
  if (typeof blockNumber !== "number") {
    return res.status(400).json({ error: "The 'blockNumber' field is required and must be a number." });
  }

  try {
    const updatedRecord = await prisma.eventSync.upsert({
      where: { eventName },
      update: { lastBlock: blockNumber },
      create: { eventName, lastBlock: blockNumber },
    });

    return res.status(200).json({ eventName, updatedBlockNumber: updatedRecord.lastBlock });
  } catch (error) {
    return res.status(500).json({ error: error.response.data });
  }
};

export { getEventSync, updateEventSync };
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
        data: { eventName, lastBlock: 0n },
      });
    }

    return res.status(200).json({ eventName, lastBlock: BigInt(record.lastBlock) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateEventSync = async (req, res) => {
  const { eventName } = req.query;
  const { blockNumber } = req.body;


  if (!eventName) {
    return res.status(400).json({ error: "The 'eventName' query parameter is required." });
  }

  try {
    const updatedRecord = await prisma.eventSync.upsert({
      where: { eventName },
      update: { lastBlock: BigInt(blockNumber) },
      create: { eventName, lastBlock: BigInt(blockNumber) },
    });

    return res.status(200).json({ eventName, updatedBlockNumber: BigInt(updatedRecord.lastBlock) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getEventSync, updateEventSync };
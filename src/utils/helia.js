import fsPromises from 'fs/promises';
import { create } from 'ipfs-http-client';
import path from 'path';

async function uploadOnHelia(filePath) {
  if (!filePath) {
    throw new Error('No file path provided.');
  }

  const normalizedPath = path.normalize(filePath).replace(/\\/g, '/');

  const ipfs = create({ url: 'http://localhost:5001' });
  
  const fileBuffer = await fsPromises.readFile(normalizedPath);

  const result = await ipfs.add(fileBuffer);
  
  await fsPromises.unlink(normalizedPath);
  
  const url = `http://localhost:8080/ipfs/${result.cid.toString()}`;
  return url;
}

export default uploadOnHelia;

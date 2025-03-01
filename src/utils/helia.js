import fsPromises from 'fs/promises';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import path from 'path';

async function uploadOnHelia(filePath) {
  if (!filePath) {
    throw new Error('No file path provided.');
  }

  const normalizedPath = path.normalize(filePath).replace(/\\/g, '/');

  const helia = await createHelia();
  const ipfsFs = unixfs(helia);

  const fileBuffer = await fsPromises.readFile(normalizedPath);
  const uint8Array = new Uint8Array(fileBuffer);

  const cid = await ipfsFs.addFile({ path: normalizedPath, content: uint8Array });

  await fsPromises.unlink(normalizedPath);

  const url = `https://dweb.link/ipfs/${cid.toString()}`;
  return url;
}

export default uploadOnHelia;

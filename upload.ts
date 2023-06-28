import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { config } from 'dotenv';
import path from 'path';

config();

async function uploadDir(relativePath: string, verbose=true) {
  const absolutePath = path.resolve(relativePath);
  const files = await getFilesFromPath(absolutePath, { pathPrefix: absolutePath })
  if (verbose) {
    console.log(`Uploading ${files.length} files:`);
    for (const { name } of files) {
      console.log(name);
    }
  }
  if (!process.env.WEB3STORAGE_API_KEY) {
    throw new Error("No API key in environment");
  }
  const storage = new Web3Storage({ token: process.env.WEB3STORAGE_API_KEY });
  const cid = await storage.put(files);
  if (verbose) {
    console.log('CID:', cid);
    console.log('Dweb:', `https://${cid}.ipfs.dweb.link`);
  }
  return cid;
}

async function main() {
  await uploadDir('./example_website/');
}

main();

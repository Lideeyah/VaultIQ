import { Web3Storage, File } from 'web3.storage';

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });

export async function uploadToIPFS(file) {
  const fileToUpload = new File([file.buffer], file.originalname);
  const cid = await client.put([fileToUpload]);
  return `https://${cid}.ipfs.w3s.link/${file.originalname}`;
}
  
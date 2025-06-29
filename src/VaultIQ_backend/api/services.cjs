// vaultiq-backend/api/services.js

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Mock call to AI verifier
async function callVerifierAPI(fileUrl, metadata) {
  return {
    status: "Verified",
    score: Math.floor(Math.random() * 100)
  };
}

// Simulate uploading to IPFS
async function uploadToIPFS(file) {
  const fakeHash = "QmFakeIPFSHash" + Math.random().toString().slice(2, 8);
  return `https://ipfs.io/ipfs/${fakeHash}`;
}

module.exports = {
  callVerifierAPI,
  uploadToIPFS
};

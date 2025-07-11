// index.cjs (main server file, assumed entry point)
import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { PrismaClient } from "@prisma/client";
import { uploadToIPFS } from "./utils/ipfs.js";
import { callVerifierAPI } from "./utils/verifier.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const upload = multer();
const require = createRequire(import.meta.url);
require("dotenv").config();


app.use(cors());
app.use(express.json());

app.post("/submit-asset", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const metadata = JSON.parse(req.body.metadata);
    const owner = req.body.owner || "default-owner";

    const fileUrl = await uploadToIPFS(file);
    const { status, score } = await callVerifierAPI(fileUrl, metadata);

    const asset = await prisma.asset.create({
      data: {
        fileUrl,
        metadata,
        status,
        score,
        owner
      },
    });

    res.status(200).json(asset);
  } catch (error) {
    console.error("Error submitting asset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// utils/ipfs.js
import { Web3Storage, File } from "web3.storage";

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });


// utils/verifier.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: fileUrl } },
        ],
      },
    ],
    max_tokens: 300,
  });

  const content = response.choices[0].message.content;

  const scoreMatch = content.match(/score[:\-]?\s?(\d{1,3})/i);
  const statusMatch = content.match(/status[:\-]?\s?(Verified|Rejected)/i);

  const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
  const status = statusMatch ? statusMatch[1] : "Unverified";



app.listen(PORT, () => {
  console.log(`VaultIQ backend running on http://localhost:${PORT}`);
});



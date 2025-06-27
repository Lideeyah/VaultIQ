// vaultiq-backend/api/index.js
//this part handles HTTP requests related to document submission.

// vaultiq-backend/api/index.js
// Handles HTTP requests related to document submission and asset management

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { callVerifierAPI, uploadToIPFS } = require("./services");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });
const app = express();

app.use(cors());
app.use(express.json());

// Route: Submit an asset
app.post("/api/assets/submit", upload.single("document"), async (req, res) => {
  try {
    const { metadata } = req.body;
    const fileUrl = await uploadToIPFS(req.file);
    const aiResponse = await callVerifierAPI(fileUrl, metadata);

    const asset = await prisma.asset.create({
      data: {
        fileUrl,
        metadata: JSON.parse(metadata),
        status: aiResponse.status,
        score: aiResponse.score,
        owner: req.user.wallet,
      },
    });

    res.status(200).json({ id: asset.id, status: asset.status, score: asset.score });
  } catch (err) {
    console.error("Error submitting asset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: Create an asset (no file upload)
app.post("/assets", async (req, res) => {
  const { fileUrl, metadata, status, score, owner } = req.body;
  try {
    const asset = await prisma.asset.create({
      data: { fileUrl, metadata, status, score, owner },
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: "Failed to create asset." });
  }
});

// Route: Get all assets
app.get("/assets", async (req, res) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assets." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("VaultIQ Backend is running ");
});

app.listen(PORT, () => {
  console.log(`VaultIQ backend running on http://localhost:${PORT}`);
});

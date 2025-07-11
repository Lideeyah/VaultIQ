// vaultiq-backend/api/index.js
//this part handles HTTP requests related to document submission.

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { callVerifierAPI, uploadToIPFS } = require("./services");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("./middleware/auth");

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/assets/submit", authMiddleware, upload.single("document"), async (req, res) => {
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
        owner: req.user.wallet
      }
    });

    res.status(200).json({ id: asset.id, status: asset.status, score: asset.score });
  } catch (err) {
    console.error("Error submitting asset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => console.log("VaultIQ backend running on port 5000"));

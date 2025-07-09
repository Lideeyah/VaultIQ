router.post("/submit", upload.single("document"), authMiddleware, async (req, res) => {
  const { metadata } = req.body;
  const fileUrl = await uploadToIPFS(req.file); // or S3
  const aiResponse = await callVerifierAPI(fileUrl, metadata);

  await db.asset.create({
    data: {
      fileUrl,
      metadata,
      status: aiResponse.status,
      score: aiResponse.score,
      owner: req.user.wallet
    }
  });

  res.json({ status: aiResponse.status, score: aiResponse.score });
});

await axios.post(process.env.CCIP_ENDPOINT, {
  assetId: asset.id,
  status: asset.status,
  score: asset.score,
});


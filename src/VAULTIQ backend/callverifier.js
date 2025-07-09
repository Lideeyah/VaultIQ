import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callVerifierAPI(fileUrl, metadata) {
  const prompt = `This document is a "${metadata.name}". Describe it, and assign a verification status and confidence score.`;

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

  // You can extract score and status with regex or simple parsing
  const scoreMatch = content.match(/score[:\-]?\s?(\d{1,3})/i);
  const statusMatch = content.match(/status[:\-]?\s?(Verified|Rejected)/i);

  const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
  const status = statusMatch ? statusMatch[1] : "Unverified";

  return { score, status };
}

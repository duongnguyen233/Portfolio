import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 8787;

const forceFirstPersonVoice = (text) => {
  if (!text || typeof text !== "string") return text;

  let rewritten = text
    .replace(/\b[Bb]ased on your\b/g, "Based on my")
    .replace(/\b[Yy]ou've\b/g, "I have")
    .replace(/\b[Yy]ou will\b/g, "I will")
    .replace(/\b[Yy]ou can\b/g, "I can")
    .replace(/\b[Yy]ou worked\b/g, "I worked")
    .replace(/\b[Yy]ou developed\b/g, "I developed")
    .replace(/\b[Yy]ou built\b/g, "I built")
    .replace(/\b[Yy]our\b/g, "my")
    .replace(/\b[Yy]ou are\b/g, "I am")
    .replace(/\b[Yy]ou have\b/g, "I have")
    .replace(/\b[Yy]ours\b/g, "mine")
    .replace(/\b[Yy]ou\b/g, "I");

  // Final guard: if reply still starts with second person, force first person start.
  if (/^\s*you\b/i.test(rewritten)) {
    rewritten = rewritten.replace(/^\s*you\b/i, "I");
  }

  return rewritten;
};

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/ask", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Missing OPENAI_API_KEY on server.",
    });
  }

  const { question, context } = req.body || {};
  if (!question || typeof question !== "string") {
    return res.status(400).json({
      error: "Question is required.",
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const systemPrompt =
    "You are Duong Nguyen, the owner of this portfolio. Answer as Duong speaking directly. " +
    "Always answer in the first person. " +
    "Answer only based on the provided profile and project context. " +
    "If data is missing, clearly say you do not have enough information. " +
    "Write all answers in strict first person voice only (use 'I', 'my', 'me'). " +
    "Never use second person pronouns ('you', 'your') when describing the profile. " +
    "Do not refer to the portfolio owner as 'he', 'him', 'they', or 'the candidate'. " +
    "Do not mention being an AI assistant unless explicitly asked.";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Context:\n${context || "No additional context provided."}`,
              },
              {
                type: "input_text",
                text: `Question:\n${question}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorPayload?.error?.message || "OpenAI request failed.",
      });
    }

    const data = await response.json();

    const answerFromOutputItems = Array.isArray(data?.output)
      ? data.output
          .flatMap((item) => item?.content || [])
          .map((contentItem) => contentItem?.text?.trim())
          .filter(Boolean)
          .join("\n")
      : "";

    const rawAnswer =
      data?.output_text?.trim() ||
      answerFromOutputItems ||
      "I could not generate an answer. Please try rephrasing the question.";

    const answer = forceFirstPersonVoice(rawAnswer);

    return res.json({ answer });
  } catch (_error) {
    return res.status(500).json({
      error: "Server error while contacting OpenAI.",
    });
  }
});

app.listen(port, () => {
  console.log(`AI API server listening on http://localhost:${port}`);
});

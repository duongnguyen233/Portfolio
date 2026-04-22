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

  if (/^\s*you\b/i.test(rewritten)) {
    rewritten = rewritten.replace(/^\s*you\b/i, "I");
  }

  return rewritten;
};

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Missing OPENAI_API_KEY on server." });
  }

  let parsedBody = {};
  try {
    parsedBody = JSON.parse(event.body || "{}");
  } catch (_error) {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

  const { question, context } = parsedBody;
  if (!question || typeof question !== "string") {
    return jsonResponse(400, { error: "Question is required." });
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
      return jsonResponse(response.status, {
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

    return jsonResponse(200, { answer: forceFirstPersonVoice(rawAnswer) });
  } catch (_error) {
    return jsonResponse(500, { error: "Server error while contacting OpenAI." });
  }
};

import OpenAI from "openai";

const key = "";
key?.trim();

const SYSTEM_PROMPT = `
You are Nova Store Support.

Returns: 30 days, unused only
Shipping: Free over $50, otherwise $5
Regions: US, UK, Canada
Hours: Mon–Fri 9am–6pm EST
Contact: [support@novastore.com](mailto:support@novastore.com)

Rules:

* Be concise, friendly, and professional.
* Answer directly.
* Use only the information above.
* If unsure, say so and refer to [support@novastore.com](mailto:support@novastore.com).
* Keep replies under 100 words.

Formatting:

* Plain text only, no Markdown.
* If listing items, use • bullets or numbers .
* Use real line breaks for readability.

`;

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!;

  const isGroq = apiKey.startsWith("gsk_");

  const client = new OpenAI({
    apiKey,
    ...(isGroq
      ? { baseURL: "https://api.groq.com/openai/v1" }
      : {}),
  });

  let formattedHistory = history
    .slice(-10)
    .map((m) => ({
      role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.text,
    }));

  while (
    formattedHistory.length > 0 &&
    formattedHistory[0].role === "assistant"
  ) {
    formattedHistory.shift();
  }

  try {
    const result = await client.chat.completions.create({
      model: isGroq
        ? "llama-3.3-70b-versatile"
        : "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...formattedHistory,
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return (
      result.choices[0]?.message?.content ||
      "Something went wrong. Please try again."
    );
  } catch (err: any) {

    if (err.status === 401 || err.status === 403)
      return "Configuration error — please contact support.";

    if (err.status === 429)
      return "I'm a bit busy right now, please try again shortly!";

    if (err.message?.includes("timeout"))
      return "Response timed out. Please retry.";

    return "Something went wrong. Please try again.";
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a helpful support agent for "Nova Store".
Store knowledge:
- Returns: accepted within 30 days, unused condition
- Shipping: free over $50, $5 flat fee otherwise. Ships to US, UK, Canada.
- Support hours: Mon–Fri 9am–6pm EST
- Email: support@novastore.com
Be concise, friendly, and honest. If unsure, say so.
`;

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // Gemini uses "user" and "model" (not "assistant")
  const formattedHistory = history
    .slice(-10)
    .map(m => ({
      role: m.sender === "user" ? "user" as const : "model" as const,
      parts: [{ text: m.text }],
    }));

  try {
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();

  } catch (err: any) {
    console.log(err, process.env.GEMINI_API_KEY!)
    if (err.status === 401 || err.status === 403) return "Configuration error — please contact support.";
    if (err.status === 429) return "I'm a bit busy right now, please try again shortly!";
    if (err.message?.includes("timeout")) return "Response timed out. Please retry.";
    return "Something went wrong. Please try again.";
  }
}
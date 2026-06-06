import { Router, Request, Response } from "express";
import {
  createConversation,
  conversationExists,
  insertMessage,
  getMessagesByConversation,
  touchConversation
} from "../db/queries";
import { generateReply } from "../services/llm";

interface Message{
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string,
  conversation_id?: string;
}
const router = Router();

router.get('/',(req, res) => {
    const id = createConversation()
    res.send(`hello shreyaaaa ${id}`)
    console.log(id)

})

const MAX_MESSAGE_LENGTH = 2000;

router.post("/message", async (req: Request, res: Response) => {
  const { message, sessionId } = req.body;

  // --- Input validation ---
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message too long. Max ${MAX_MESSAGE_LENGTH} characters.` });
  }

  // --- Session handling ---
  let convId: string;

  if (sessionId && conversationExists(sessionId)) {
    convId = sessionId;
  } else {
    convId = createConversation();
  }

  // --- Persist user message ---
  insertMessage(convId, "user", trimmed);
  touchConversation(convId);

  // --- Get history for LLM ---
  const history  = getMessagesByConversation(convId) as  Message[];

  // --- Call LLM ---
  const reply = await generateReply(
    history.map( m  => ({ sender: m.sender, text: m.text })), 
    trimmed);
    //  const reply = ` hehe heyooo`

  // --- Persist AI reply ---
  insertMessage(convId, "ai", reply);

  return res.json({ reply, sessionId: convId });
});

// Fetch history for a session (for page reload)
router.get("/history/:sessionId", (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!conversationExists(sessionId)) {
    return res.status(404).json({ error: "Session not found." });
  }

  const messages = getMessagesByConversation(sessionId);
  return res.json({ messages, sessionId });
});


export default router
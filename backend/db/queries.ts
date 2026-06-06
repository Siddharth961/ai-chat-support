import { v4 as uuid } from "uuid";
import db from "./client";

// --- Conversations ---

export function createConversation() {
  const id = `conv_${uuid()}`;
  db.prepare(`INSERT INTO conversations (id) VALUES (?)`).run(id);
  return id;
}

export function conversationExists(id: string): boolean {
  const row = db.prepare(`SELECT id FROM conversations WHERE id = ?`).get(id);
  return !!row;
}

export function touchConversation(id: string) {
  db.prepare(`UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
}

// --- Messages ---

export function insertMessage(conversationId: string, sender: "user" | "ai", text: string) {
  const id = `msg_${uuid()}`;
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender, text)
    VALUES (?, ?, ?, ?)
  `).run(id, conversationId, sender, text);
  return id;
}

export function getMessagesByConversation(conversationId: string) {

  return db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY timestamp ASC
  `).all(conversationId);
}
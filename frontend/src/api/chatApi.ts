import type { Message } from "../types/chat";
const BASE = import.meta.env.VITE_API_BASE_URL;

export async function postMessage(message: string, sessionId: string | null) {

    console.log('api called', BASE)
  const res = await fetch(`${BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data as { reply: string; sessionId: string };
}

export async function fetchHistory(sessionId: string) {
  const res = await fetch(`${BASE}/chat/history/${sessionId}`);
  if (!res.ok) throw new Error('Session not found.');

  const data  = await res.json();
  return data as { messages: Message[]; sessionId: string } ;
}
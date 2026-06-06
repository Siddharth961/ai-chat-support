export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string,
  conversation_id?: string;
}
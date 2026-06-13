import { useState, useEffect } from 'react';
import type { Message } from '../types/chat';
import { postMessage, fetchHistory } from '../api/chatApi';

const SESSION_KEY = 'nova_session_id';

export function useChat() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY)
  );

  useEffect(() => {
    
    
    fetchHistory(sessionId)
        .then(data => setMessages(data.messages))
        .catch(() => {
          if(messages.length === 0){
            setMessages([{
              id: '0',
                sender: "ai",
                text: "Hi, How may I help you today!",
                timestamp: new Date().toISOString()
            }])
          }

          localStorage.removeItem(SESSION_KEY);
          
          setSessionId(null);
        })
        
        
    
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `tmp_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await postMessage(text.trim(), sessionId);
      setSessionId(data.sessionId);
      localStorage.setItem(SESSION_KEY, data.sessionId);

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
}
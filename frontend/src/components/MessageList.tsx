import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.length === 0 && !isLoading && (
        <p className="empty-state">Ask me anything about Nova Store.</p>
      )}
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="message message--ai">
          <div className="bubble typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
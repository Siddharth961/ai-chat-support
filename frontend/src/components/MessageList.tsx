import { useEffect, useRef, useState } from 'react';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScroll, setShowScroll] = useState(false);

  // logic to observe if we are on bottom, if not we show scroll to bottom button 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowScroll(!entry.isIntersecting),
      { threshold: 1.0 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list-wrapper">
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

      {showScroll && (
        <button
          className="scroll-to-bottom"
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to bottom"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
        </button>
      )}
    </div>
  );
}
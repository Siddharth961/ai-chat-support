import type { Message } from '../types/chat';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={`message ${isUser ? 'message--user' : 'message--ai'}`}>
      <div className="bubble">{message.text}</div>
      <span className="timestamp">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        })}
      </span>
    </div>
  );
}
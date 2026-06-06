import { useChat } from './hooks/useChat';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';
import './App.css';

export default function App() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-header-dot" />
        Nova Store Support
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      {error && <p className="error-banner">{error}</p>}

      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
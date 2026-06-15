import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';
import './App.css';

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-header-dot" />
        <span>Nova Store Support</span>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      {error && <p className="error-banner">{error}</p>}

      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── Store page ── */}
      <div className="store">

        <nav className="store-nav">
          <span className="store-logo">Nova Store</span>
          <div className="store-nav-links">
            <a href="#">Home</a>
            <a href="#">Shop</a>
            <a href="#">About</a>
          </div>
        </nav>

        <section className="store-hero">
          <p className="store-hero-tag">Free shipping over $50</p>
          <h1>Modern goods,<br />minimal prices.</h1>
          <p className="store-hero-sub">Curated everyday essentials delivered to your door.</p>
          <button className="store-cta">Shop Now</button>
        </section>

        <section className="store-products">
          {[
            { name: 'Canvas Tote', price: '$24', tag: 'Bestseller' },
            { name: 'Ceramic Mug', price: '$18', tag: 'New' },
            { name: 'Linen Notebook', price: '$14', tag: null },
            { name: 'Wooden Pen', price: '$9', tag: 'Sale' },
          ].map(p => (
            <div className="store-card" key={p.name}>
              <div className="store-card-img">
                {p.tag && <span className="store-card-tag">{p.tag}</span>}
              </div>
              <div className="store-card-info">
                <span className="store-card-name">{p.name}</span>
                <span className="store-card-price">{p.price}</span>
              </div>
            </div>
          ))}
        </section>

      </div>

      {/* ── Chat widget ── */}
      <div className="chat-widget">
        <div className={`chat-widget-wrapper ${isOpen ? "open" : "closed"}`}>

          <ChatPanel onClose={() => setIsOpen(false)} />
        </div>
        <button
          className="chat-launcher"
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
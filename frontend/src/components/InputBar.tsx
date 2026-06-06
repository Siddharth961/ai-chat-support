import { useState } from 'react';
import type { KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="input-bar">
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={e => setValue(e.target.value.slice(0, 2000))}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        aria-label="Message"
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send"
      >
        Send
      </button>
    </div>
  );
}
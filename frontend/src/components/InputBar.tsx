import { useState, useRef } from 'react';
import type {KeyboardEvent} from 'react'

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  return (
    <div className="input-bar">
      <textarea
        ref={textareaRef}
        className="input-field"
        value={value}
        onChange={e => setValue(e.target.value.slice(0, 2000))}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Type a message..."
        rows={1}
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
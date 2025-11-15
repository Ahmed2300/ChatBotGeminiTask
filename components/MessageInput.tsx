import React, { useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSendMessage: (input: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSendMessage(input);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-white border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 disabled:opacity-50 max-h-48"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white rounded-lg p-3 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;
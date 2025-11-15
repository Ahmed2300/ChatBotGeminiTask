import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 ${
            message.role === 'user' ? 'justify-end' : ''
          }`}
        >
          {message.role === 'model' && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg p-4 shadow-sm ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans break-words">
              {message.content}
              {isLoading && index === messages.length - 1 && (
                 <span className="animate-pulse">▍</span>
              )}
            </pre>
          </div>
          {message.role === 'user' && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      ))}
    </main>
  );
};

export default ChatHistory;
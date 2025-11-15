import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage, ChatSession } from './types';
import { MODELS } from './constants';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const [chat, setChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);
          setActiveSessionId(parsedSessions[0].id);
          setSelectedModel(parsedSessions[0].model);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
    }
    // If no sessions, create a new one
    handleNewChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        try {
            localStorage.setItem('chatSessions', JSON.stringify(sessions));
        } catch (e) {
            console.error("Failed to save sessions to localStorage", e);
        }
    }
  }, [sessions]);

  const activeSession = useMemo(() => {
    return sessions.find((session) => session.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  // Initialize or re-initialize the chat instance when the active session changes
  useEffect(() => {
    if (!activeSession) return;
    if (!process.env.API_KEY) {
      setError("API_KEY environment variable not set. Please configure it to use the application.");
      return;
    }
    setError(null);
    try {
        const messagesForHistory = [...activeSession.messages];
        const lastMessage = messagesForHistory[messagesForHistory.length - 1];
        // If the last message is an empty model message (our placeholder), remove it for history initialization.
        if (lastMessage && lastMessage.role === 'model' && lastMessage.content === '') {
            messagesForHistory.pop();
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const newChat = ai.chats.create({
          model: activeSession.model,
          history: messagesForHistory.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
          })),
        });
        setChat(newChat);
    } catch(err) {
        console.error("Error initializing chat:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred during chat initialization.");
    }
  }, [activeSession]);

  const handleSendMessage = async (userInput: string) => {
    if (!chat || isLoading || !userInput.trim() || !activeSession) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    const modelMessagePlaceholder: ChatMessage = { role: 'model', content: '' };

    setSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId
          ? {
              ...session,
              title: session.messages.length === 0 ? userInput.substring(0, 40) : session.title,
              messages: [...session.messages, userMessage, modelMessagePlaceholder],
            }
          : session
      )
    );
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userInput });
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setSessions(prev => {
          return prev.map(s => {
            if (s.id === activeSessionId) {
              const newMessages = [...s.messages];
              newMessages[newMessages.length - 1].content += chunkText;
              return { ...s, messages: newMessages };
            }
            return s;
          });
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setSessions(prev =>
        prev.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages];
                newMessages[newMessages.length - 1].content = `Error: Could not get a response. ${errorMessage}`;
                return { ...s, messages: newMessages };
            }
            return s;
        })
      );
    } finally {
      setIsLoading(false);
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      model: selectedModel,
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
        setActiveSessionId(id);
        setSelectedModel(session.model);
        setIsSidebarOpen(false);
    }
  };

  const handleModelChange = (modelId: string) => {
      setSelectedModel(modelId);
      if (activeSessionId) {
          setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, model: modelId } : s));
      }
  }

  return (
    <div className="flex h-screen font-sans bg-gray-100">
        <Sidebar 
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            isOpen={isSidebarOpen}
        />
        <div className="flex-1 flex flex-col relative min-w-0">
            {isSidebarOpen && (
                <div 
                    className="absolute inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <Header 
                selectedModel={selectedModel} 
                setSelectedModel={handleModelChange}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
                {error ? (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                        <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">
                            <h2 className="font-bold text-lg mb-2 text-red-900">Configuration Error</h2>
                            <p>{error}</p>
                        </div>
                    </div>
                ) : activeSession ? (
                    <>
                        <ChatHistory messages={activeSession.messages} isLoading={isLoading} />
                        <MessageInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a chat or start a new one.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default App;

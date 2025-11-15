import React from 'react';
import { ChatSession } from '../types';
import { Plus } from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  isOpen,
}) => {
  return (
    <aside
      className={`absolute z-20 h-full w-64 bg-gray-50 border-r border-gray-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex-shrink-0 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {sessions.map((session) => (
            <li key={session.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSession(session.id);
                }}
                className={`block w-full text-left truncate rounded-md px-3 py-2 text-sm font-medium ${
                  session.id === activeSessionId
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {session.title || 'New Chat'}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
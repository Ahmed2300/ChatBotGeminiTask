import React from 'react';
import { MODELS } from '../constants';
import { Menu } from 'lucide-react';

interface HeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedModel, setSelectedModel, onMenuClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gemini Chat</h1>
      </div>
      <div className="relative">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
        >
          {MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
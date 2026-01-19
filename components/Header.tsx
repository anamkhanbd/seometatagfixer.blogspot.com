import React from 'react';
import { Sparkles, Moon, Sun, Globe } from 'lucide-react';
import { Translation, Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  t: Translation;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, isDark, setIsDark, t }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <Sparkles size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-500 dark:to-indigo-400">
                {t.title}
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe size={16} />
              <span>{lang === 'en' ? 'EN' : 'BN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Copy, Check, Download, Code, Hash, Activity, FileJson, FileText, Tag } from 'lucide-react';
import { SEOData, Translation } from '../types';
import SEOScore from './SEOScore';

interface ResultTabsProps {
  data: SEOData;
  html: string;
  t: Translation;
  onExport: (format: 'json' | 'txt') => void;
}

const ResultTabs: React.FC<ResultTabsProps> = ({ data, html, t, onExport }) => {
  const [activeTab, setActiveTab] = useState<'meta' | 'html' | 'keywords' | 'score'>('meta');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'meta', label: t.tabMeta, icon: <Tag size={16} /> },
    { id: 'html', label: t.tabHtml, icon: <Code size={16} /> },
    { id: 'keywords', label: t.tabKeywords, icon: <Hash size={16} /> },
    { id: 'score', label: t.tabScore, icon: <Activity size={16} /> },
  ] as const;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
      {/* Tab Header */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 outline-none
              ${activeTab === tab.id
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800/50'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        
        {/* Export Buttons (Right Aligned on Desktop) */}
        <div className="flex-grow flex items-center justify-end px-4 py-2 gap-2">
            <button 
                onClick={() => onExport('json')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
                <FileJson size={14} />
                {t.downloadJson}
            </button>
            <button 
                onClick={() => onExport('txt')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
                <FileText size={14} />
                {t.downloadTxt}
            </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Meta Tags View */}
        {activeTab === 'meta' && (
          <div className="space-y-6">
            <div className="group relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Title Tag</label>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 font-medium">
                {data.title}
              </div>
              <button
                onClick={() => handleCopy(data.title, 'title')}
                className="absolute top-8 right-2 p-2 rounded-md text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                title={t.copy}
              >
                {copied === 'title' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="group relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Meta Description</label>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 leading-relaxed">
                {data.description}
              </div>
               <button
                onClick={() => handleCopy(data.description, 'desc')}
                className="absolute top-8 right-2 p-2 rounded-md text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                title={t.copy}
              >
                {copied === 'desc' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
             <div className="group relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Robots</label>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 font-mono text-sm">
                {data.robots}
              </div>
            </div>
          </div>
        )}

        {/* HTML Code View */}
        {activeTab === 'html' && (
          <div className="relative group">
            <pre className="p-6 bg-slate-900 rounded-lg overflow-x-auto border border-slate-700">
              <code className="text-sm font-mono text-blue-300">
                {html}
              </code>
            </pre>
            <button
              onClick={() => handleCopy(html, 'html')}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-sm transition-colors"
            >
              {copied === 'html' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'html' ? t.copied : t.copy}
            </button>
          </div>
        )}

        {/* Keywords View */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                {t.keywordsPrimary}
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.keywordsDetailed.primary.map((k, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 text-sm font-medium border border-brand-100 dark:border-brand-800 cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                    onClick={() => handleCopy(k, `k-p-${i}`)}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {t.keywordsSecondary}
              </h4>
              <div className="flex flex-wrap gap-2">
                 {data.keywordsDetailed.secondary.map((k, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    onClick={() => handleCopy(k, `k-s-${i}`)}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

             <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {t.keywordsLongTail}
              </h4>
              <div className="flex flex-wrap gap-2">
                 {data.keywordsDetailed.longTail.map((k, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm font-medium border border-emerald-100 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                   onClick={() => handleCopy(k, `k-l-${i}`)}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Score View */}
        {activeTab === 'score' && (
          <SEOScore score={data.score} tips={data.tips} t={t} />
        )}
      </div>
    </div>
  );
};

export default ResultTabs;
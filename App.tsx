import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Trash2 } from 'lucide-react';
import Header from './components/Header';
import ResultTabs from './components/ResultTabs';
import AdUnit from './components/AdUnit';
import LatestPosts from './components/LatestPosts';
import { analyzeContent } from './services/geminiService';
import { DICTIONARY } from './constants';
import { Language, SEOData } from './types';

// Ad Keys provided
const AD_KEY_160_600 = 'f2668bd84268bc931195baa771060cd0'; // Desktop Sidebars
const AD_KEY_728_90 = '1db833156a625059c199f61f676c8b04';  // Top/Bottom

const App: React.FC = () => {
  // State
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState('');

  // Derived state
  const t = DICTIONARY[lang];

  // Effect: Handle Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Generators
  const generateHTML = (data: SEOData) => {
    const tags = [
        `<title>${data.title}</title>`,
        `<meta name="description" content="${data.description}">`,
        `<meta name="keywords" content="${data.keywords.join(', ')}">`,
        `<meta name="robots" content="${data.robots}">`
    ];
    if (data.author) {
        tags.push(`<meta name="author" content="${data.author}">`);
    }
    // Social Open Graph (Generic)
    tags.push(`<meta property="og:title" content="${data.title}">`);
    tags.push(`<meta property="og:description" content="${data.description}">`);
    
    return tags.join('\n');
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError(t.errorEmpty);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSeoData(null); // Clear previous results while loading to avoid confusion

    try {
      const data = await analyzeContent(input, lang);
      setSeoData(data);
      setGeneratedHtml(generateHTML(data));
    } catch (err) {
      console.error(err);
      setError(t.errorApi);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'json' | 'txt') => {
    if (!seoData) return;

    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
      content = JSON.stringify(seoData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = `Title: ${seoData.title}\nDescription: ${seoData.description}\nKeywords: ${seoData.keywords.join(', ')}\n\nHTML Code:\n${generatedHtml}`;
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-meta-tags.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
      setInput('');
      setSeoData(null);
      setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Header 
        lang={lang} 
        setLang={setLang} 
        isDark={isDark} 
        setIsDark={setIsDark} 
        t={t} 
      />

      {/* Top Banner Ad - Responsive scaling */}
      <div className="w-full bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="w-full max-w-[1400px] mx-auto py-4 flex justify-center items-center px-4">
           <AdUnit adKey={AD_KEY_728_90} width={728} height={90} className="shrink-0" />
        </div>
      </div>

      <div className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-center gap-6 px-4 py-8">
        
        {/* Left Sidebar Ad - Desktop Only */}
        <aside className="hidden xl:flex flex-col gap-4 min-w-[160px] sticky top-24 h-fit">
            <AdUnit adKey={AD_KEY_160_600} width={160} height={600} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-5xl space-y-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full h-48 p-4 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-y transition-all text-base leading-relaxed"
            />
            
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              {error && (
                  <span className="text-red-500 text-sm font-medium animate-pulse">
                      {error}
                  </span>
              )}
              {!error && <span className="text-gray-400 text-sm hidden sm:block">
                  {input.length} characters
              </span>}

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <button
                      onClick={clearAll}
                      disabled={loading || !input}
                      className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex"
                  >
                      <Trash2 size={18} />
                      <span className="hidden sm:inline">{t.clear}</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !input}
                    className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform active:scale-95 flex"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Wand2 size={18} />
                    )}
                    {loading ? t.analyzing : t.generateMeta}
                  </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {seoData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.results}</h2>
                  </div>
                  <ResultTabs 
                      data={seoData} 
                      html={generatedHtml} 
                      t={t} 
                      onExport={handleExport}
                  />
              </div>
          )}

          {/* Blogger Widget / Latest Posts */}
          <LatestPosts />
        </main>

        {/* Right Sidebar Ad - Desktop Only */}
        <aside className="hidden xl:flex flex-col gap-4 min-w-[160px] sticky top-24 h-fit">
            <AdUnit adKey={AD_KEY_160_600} width={160} height={600} />
        </aside>
      </div>

      {/* Bottom Banner Ad - Responsive scaling */}
      <div className="w-full bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 mt-auto">
        <div className="w-full max-w-[1400px] mx-auto py-4 flex justify-center items-center px-4">
           <AdUnit adKey={AD_KEY_728_90} width={728} height={90} className="shrink-0" />
        </div>
      </div>

      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <p>© {new Date().getFullYear()} Meta Tag Fixer. AI SEO Utility.</p>
      </footer>
    </div>
  );
};

export default App;
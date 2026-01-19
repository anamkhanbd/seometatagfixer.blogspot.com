export type Language = 'en' | 'bn';

export interface Translation {
  title: string;
  tagline: string;
  inputPlaceholder: string;
  generateMeta: string;
  generateHtml: string;
  analyzing: string;
  results: string;
  tabMeta: string;
  tabHtml: string;
  tabKeywords: string;
  tabScore: string;
  copy: string;
  copied: string;
  downloadJson: string;
  downloadTxt: string;
  keywordsPrimary: string;
  keywordsSecondary: string;
  keywordsLongTail: string;
  scoreTitle: string;
  scoreGood: string;
  scoreAverage: string;
  scorePoor: string;
  tipsTitle: string;
  clear: string;
  errorEmpty: string;
  errorApi: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  robots: string;
  author: string;
  score: number;
  tips: string[];
  keywordsDetailed: {
    primary: string[];
    secondary: string[];
    longTail: string[];
  };
}

export interface GeneratedResult {
  data: SEOData | null;
  html: string;
  timestamp: number;
}
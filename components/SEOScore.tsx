import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Translation } from '../types';

interface SEOScoreProps {
  score: number;
  tips: string[];
  t: Translation;
}

const SEOScore: React.FC<SEOScoreProps> = ({ score, tips, t }) => {
  // Ensure score is a valid number, default to 0 if missing or NaN
  const validScore = (typeof score === 'number' && !isNaN(score)) ? score : 0;

  const data = [
    { name: 'Score', value: validScore },
    { name: 'Remaining', value: 100 - validScore },
  ];

  let color = '#ef4444'; // Red (Poor)
  let statusText = t.scorePoor;

  if (validScore >= 80) {
    color = '#22c55e'; // Green (Good)
    statusText = t.scoreGood;
  } else if (validScore >= 50) {
    color = '#eab308'; // Yellow (Average)
    statusText = t.scoreAverage;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
      {/* Chart Section */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#e2e8f0" className="dark:fill-slate-700" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{validScore}</span>
          <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">/ 100</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.scoreTitle}</h3>
        <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></div>
            <span className="font-medium" style={{color: color}}>{statusText}</span>
        </div>

        <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.tipsTitle}</h4>
            <ul className="space-y-2">
                {tips.length > 0 ? (
                    tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                           <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                           {tip}
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-500 italic">No specific tips available.</li>
                )}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default SEOScore;
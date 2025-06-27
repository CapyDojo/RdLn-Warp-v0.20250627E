import React from 'react';
import { Scale, Zap, Image } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-theme-primary-900 to-theme-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-theme-accent-500 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif">RdLn</h1>
              <p className="text-theme-primary-200 text-sm">Professional Legal Document Comparison with OCR</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Image className="w-4 h-4 text-theme-accent-400" />
              <span className="text-theme-primary-200">Screenshot OCR</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-theme-accent-400" />
              <span className="text-theme-primary-200">Lightning-fast • Client-side • Confidential</span>
            </div>
            <ThemeSelector />
            {/* Temporary Logo Test Link - REMOVE AFTER TESTING */}
            <a 
              href="/logo-test" 
              className="text-theme-primary-200 hover:text-white text-sm underline transition-colors"
              title="View logo concept designs"
            >
              Logo Test
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
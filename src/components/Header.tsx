import React from 'react';
import { Zap, Image } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

export const Header: React.FC = () => {
  return (
    <header className="floating-header">
      <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl border border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-theme-primary-500 to-theme-primary-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{ flexShrink: 0, aspectRatio: '1/1' }}
            >
              <span className="text-white text-lg font-bold font-serif leading-none tracking-tighter">
                RdLn
              </span>
            </div>
            <span className="hidden sm:block text-theme-primary-800 font-semibold text-lg tracking-tight">
              Legal Redline
            </span>
          </div>
          
          {/* Feature Highlights - Compact for floating nav */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-theme-accent-100/50 rounded-lg border border-theme-accent-200/50">
              <Image className="w-4 h-4 text-theme-accent-600" />
              <span className="text-theme-accent-800 font-medium text-sm">OCR</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-theme-secondary-100/50 rounded-lg border border-theme-secondary-200/50">
              <Zap className="w-4 h-4 text-theme-secondary-600" />
              <span className="text-theme-secondary-800 font-medium text-sm">Fast</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <ThemeSelector />
            {/* Temporary Logo Test Link - REMOVE AFTER TESTING */}
            <a 
              href="/logo-test" 
              className="px-3 py-2 bg-theme-primary-100/50 hover:bg-theme-primary-200/50 text-theme-primary-700 hover:text-theme-primary-800 text-sm font-medium rounded-lg border border-theme-primary-200/50 transition-all duration-200"
              title="View logo concept designs"
            >
              Logo Test
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

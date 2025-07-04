import React from 'react';
import { ThemeSelector } from './ThemeSelector';

export const Header: React.FC = () => {
  return (
    <header className="floating-header">
      <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl border border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div 
              className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-theme-primary-300 to-theme-primary-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{ flexShrink: 0, aspectRatio: '1/1' }}
            >
              <span 
                className="text-2xl font-bold leading-none tracking-tighter"
                style={{
                  fontFamily: 'noto sans, sans-serif',
                  background: 'linear-gradient(to top,rgb(84, 4, 4),rgb(0, 119, 44))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >
                RdLn
              </span>
            </div>
          </div>
          

          {/* Controls */}
          <div className="flex items-center gap-3">
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </header>
  );
};

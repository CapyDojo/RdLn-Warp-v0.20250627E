import React from 'react';
import { ThemeSelector } from './ThemeSelector';
import { BaseComponentProps } from '../types/components';

export const Header: React.FC<BaseComponentProps> = ({ style, className }) => {
  return (
    <header className={`floating-header ${className || ''}`} style={style}>
      <nav className="glass-panel rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-theme-primary-300 to-theme-primary-700 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
              style={{ flexShrink: 0, aspectRatio: '1/1' }}
            >
              <span 
                className="text-lg font-bold leading-none tracking-tighter"
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

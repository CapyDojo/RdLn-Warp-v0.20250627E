import React from 'react';
import { Zap, Image } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  showAdvancedOcrCard?: boolean;
  showPerformanceDemoCard?: boolean;
  onToggleAdvancedOcr?: () => void;
  onTogglePerformanceDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  showAdvancedOcrCard = true, 
  showPerformanceDemoCard = true, 
  onToggleAdvancedOcr, 
  onTogglePerformanceDemo 
}) => {
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
            {/* Dev Toggle Buttons */}
            {onToggleAdvancedOcr && (
              <button
                onClick={onToggleAdvancedOcr}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  showAdvancedOcrCard 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                title="Toggle Advanced OCR card visibility"
              >
                OCR {showAdvancedOcrCard ? 'ON' : 'OFF'}
              </button>
            )}
            {onTogglePerformanceDemo && (
              <button
                onClick={onTogglePerformanceDemo}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  showPerformanceDemoCard 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                title="Toggle Performance Demo card visibility"
              >
                Demo {showPerformanceDemoCard ? 'ON' : 'OFF'}
              </button>
            )}
            
            {/* Temporary Logo Test Link - REMOVE AFTER TESTING */}
            <a 
              href="/logo-test" 
              className="px-3 py-2 bg-theme-primary-100/50 hover:bg-theme-primary-200/50 text-theme-primary-700 hover:text-theme-primary-800 text-sm font-medium rounded-lg border border-theme-primary-200/50 transition-all duration-200"
              title="View logo concept designs"
            >
              Logo Test
            </a>
            
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </header>
  );
};

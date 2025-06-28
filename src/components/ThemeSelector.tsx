import React, { useState } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="enhanced-button flex items-center gap-2 px-3 py-2 bg-theme-primary-100 hover:bg-theme-primary-200 rounded-lg transition-all duration-200 text-theme-primary-800 shadow-lg shrink-0"
        title="Change Theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline whitespace-nowrap">Theme</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full right-0 mt-2 glass-panel border border-theme-neutral-200 rounded-lg shadow-lg z-[60] min-w-48 max-w-xs transition-all duration-300 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {availableThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    setTheme(theme.name);
                    setIsOpen(false);
                  }}
                  className="subtle-button w-full px-4 py-3 text-left hover:bg-theme-neutral-50 flex items-center justify-between group first:rounded-t-lg last:rounded-b-lg transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-theme-neutral-900 truncate">{theme.displayName}</div>
                    <div className="text-sm text-theme-neutral-600 truncate">{theme.description}</div>
                  </div>
                  {currentTheme === theme.name && (
                    <Check className="w-4 h-4 text-theme-primary-600 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
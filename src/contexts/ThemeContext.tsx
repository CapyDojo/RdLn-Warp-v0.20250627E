import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, ThemeConfig } from '../types/theme';
import { themes } from '../config/themes';

interface ThemeContextType {
  currentTheme: ThemeName;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('professional');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('rdln-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Apply CSS variables for the current theme
    const themeConfig = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(themeConfig.colors).forEach(([colorGroup, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        // Convert hex to RGB values for CSS variables
        const hex = value.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Set both the original color and RGB components
        root.style.setProperty(`--color-${colorGroup}-${shade}`, `${r} ${g} ${b}`);
        // Use space-separated values for rgb() compatibility
        root.style.setProperty(`--color-${colorGroup}-${shade}-rgb`, `${r} ${g} ${b}`);
      });
    });

    // Apply effect variables for glassmorphism
    if (themeConfig.effects) {
      Object.entries(themeConfig.effects).forEach(([effect, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--effect-${effect}`, value);
        }
      });
    }

    // DEFINITIVE FIX: Force body background with !important and remove all conflicting styles
    document.body.style.cssText = '';
    
    // Apply theme-specific body backgrounds with maximum priority and proper background settings
    switch (currentTheme) {
      case 'professional':
        document.body.style.cssText = `
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 75%, #94a3b8 100%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('💼 FORCED professional gradient background for glassmorphism');
        break;
      case 'bamboo':
        document.body.style.cssText = `
          background: linear-gradient(135deg, #5d8a3a 0%, #7ba05f 35%, #a8c49a 70%, #c8d8b8 100%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🌿 FORCED bamboo gradient background');
        break;
      case 'apple-light':
        document.body.style.cssText = `
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🍎 FORCED Apple Light gradient background');
        break;
      case 'apple-dark':
        document.body.style.cssText = `
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #171717 75%, #262626 100%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🌙 FORCED Apple Dark gradient background');
        break;
      default:
        // Fallback
        document.body.style.cssText = `
          background: #fafafa !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🔄 FORCED fallback background');
        break;
    }
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('rdln-theme', theme);
  };

  const value: ThemeContextType = {
    currentTheme,
    themeConfig: themes[currentTheme],
    setTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
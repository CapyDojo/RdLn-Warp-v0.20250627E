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
    
    // Apply theme-specific solid backgrounds + CSS noise for zero banding
    switch (currentTheme) {
      case 'professional':
        document.body.style.cssText = `
          background: #f1f5f9 !important;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(226, 232, 240, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(203, 213, 225, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.02) 0%, transparent 50%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('💼 Applied professional solid + noise (zero banding)');
        break;
      case 'bamboo':
        document.body.style.cssText = `
          background: #7ba05f !important;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(108, 153, 73, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(138, 178, 108, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(93, 138, 58, 0.03) 0%, transparent 50%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🌿 Applied bamboo solid + noise (zero banding)');
        break;
      case 'apple-light':
        document.body.style.cssText = `
          background: #f8fafc !important;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(241, 245, 249, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(226, 232, 240, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(248, 250, 252, 0.02) 0%, transparent 50%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🍎 Applied Apple Light solid + noise (zero banding)');
        break;
      case 'apple-dark':
        document.body.style.cssText = `
          background: #0a0a0a !important;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(23, 23, 23, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(38, 38, 38, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(15, 15, 15, 0.03) 0%, transparent 50%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🌙 Applied Apple Dark solid + noise (zero banding)');
        break;
      case 'kyoto':
        document.body.style.cssText = `
          background: #14532d !important;
          background-image: 
            radial-gradient(circle at 25% 15%, rgba(239, 68, 68, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 75% 25%, rgba(220, 38, 38, 0.04) 0%, transparent 35%),
            radial-gradient(circle at 60% 85%, rgba(185, 28, 28, 0.03) 0%, transparent 30%),
            radial-gradient(circle at 20% 75%, rgba(34, 197, 94, 0.05) 0%, transparent 45%),
            radial-gradient(circle at 85% 60%, rgba(22, 163, 74, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(120, 113, 108, 0.02) 0%, transparent 60%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🍁 Applied Kyoto autumn garden background (maple & forest)');
        break;
      case 'new-york':
        document.body.style.cssText = `
          background: #0a0a0a !important;
          background-image: 
            linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #451a03 100%),
            radial-gradient(circle at 50% 100%, rgba(251, 140, 0, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 25% 80%, rgba(255, 152, 0, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 75% 90%, rgba(239, 108, 0, 0.03) 0%, transparent 35%),
            repeating-linear-gradient(90deg, transparent 0%, rgba(16, 16, 16, 0.6) 2%, transparent 4%) !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
          background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 2px !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        console.log('🏙️ Applied New York Night skyline + city glow (zero banding)');
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
        console.log('🔄 Applied fallback background');
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
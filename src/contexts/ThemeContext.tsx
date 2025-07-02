import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, ThemeConfig } from '../types/theme';
import { themes, hexToRgb, hexToRgba, backgroundStyles } from '../themes';
import { generateColorVariables, generateGlassmorphismVariables, applyCSSVariables } from '../themes/utils/cssVariables';
import { getThemeFromStorage } from '../themes/utils/validation';

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

  // Load theme from localStorage on mount with validation
  useEffect(() => {
    const savedTheme = getThemeFromStorage();
    setCurrentTheme(savedTheme);
  }, []);

  // Apply theme to document root (OPTIMIZED for performance)
  useEffect(() => {
    const themeConfig = themes[currentTheme];
    
    // PERFORMANCE FIX: Batch all theme updates in a single requestAnimationFrame
    // This prevents multiple DOM reflows and improves performance
    requestAnimationFrame(() => {
      // Set data-theme attribute first for immediate CSS cascade
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      // Generate and apply all CSS variables in one batch
      const colorVariables = generateColorVariables(themeConfig);
      const glassVariables = generateGlassmorphismVariables(themeConfig);
      const allVariables = [...colorVariables, ...glassVariables];
      applyCSSVariables(allVariables);
      
      // Apply background styles
      document.body.style.cssText = backgroundStyles[currentTheme] || `
        background: #fafafa !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
        background-size: 100% 100% !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
    });
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
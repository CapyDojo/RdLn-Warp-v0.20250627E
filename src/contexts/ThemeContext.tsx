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
  reorderThemes: (fromIndex: number, toIndex: number) => void;
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

const DEFAULT_THEME_ORDER: ThemeName[] = [
  'professional',
  'bamboo',
  'apple-light',
  'apple-dark',
  'kyoto',
  'new-york',
  'autumn',
  'classic-light',
  'classic-dark'
];

const THEME_ORDER_STORAGE_KEY = 'rdln-theme-order';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('professional');
  const [themeOrder, setThemeOrder] = useState<ThemeName[]>(DEFAULT_THEME_ORDER);

  // Load theme and theme order from localStorage on mount
  useEffect(() => {
    const savedTheme = getThemeFromStorage();
    setCurrentTheme(savedTheme);
    
    // Load custom theme order
    const savedOrder = localStorage.getItem(THEME_ORDER_STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder) as ThemeName[];
        // Validate that all themes are present and no extras
        const isValidOrder = parsedOrder.length === DEFAULT_THEME_ORDER.length &&
          parsedOrder.every(theme => DEFAULT_THEME_ORDER.includes(theme)) &&
          DEFAULT_THEME_ORDER.every(theme => parsedOrder.includes(theme));
        
        if (isValidOrder) {
          setThemeOrder(parsedOrder);
        }
      } catch (error) {
        console.warn('Invalid theme order in localStorage, using default order');
      }
    }
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

  const reorderThemes = (fromIndex: number, toIndex: number) => {
    const newOrder = [...themeOrder];
    const [movedTheme] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedTheme);
    
    setThemeOrder(newOrder);
    localStorage.setItem(THEME_ORDER_STORAGE_KEY, JSON.stringify(newOrder));
  };

  // Create availableThemes in the custom order
  const availableThemes = themeOrder.map(themeName => themes[themeName]);

  const value: ThemeContextType = {
    currentTheme,
    themeConfig: themes[currentTheme],
    setTheme,
    availableThemes,
    reorderThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
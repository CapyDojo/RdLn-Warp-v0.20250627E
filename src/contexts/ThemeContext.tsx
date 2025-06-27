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

    // Generate enhanced glassmorphism effects based on theme configuration
    const effects = themeConfig.effects || {};
    
    if (effects.glassmorphism) {
      // Set basic glassmorphism variables
      root.style.setProperty('--glass-blur', effects.backdropBlur || '24px');
      root.style.setProperty('--glass-opacity', effects.backgroundOpacity || '0.8');
      
      // Shadow intensity mapping
      const shadowMap = {
        light: '0 4px 16px rgba(31, 38, 135, 0.2)',
        medium: '0 8px 32px rgba(31, 38, 135, 0.37)',
        strong: '0 12px 48px rgba(31, 38, 135, 0.5)',
        ultra: '0 16px 64px rgba(31, 38, 135, 0.7), 0 4px 16px rgba(31, 38, 135, 0.4)'
      };
      root.style.setProperty('--glass-shadow', shadowMap[effects.shadowIntensity || 'strong']);
      
      // Generate vivid gradient overlays using theme colors
      if (effects.gradientOverlay) {
        // Helper function to convert hex to rgba
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        // Use theme colors for vivid gradients
        const primaryColor = Object.values(themeConfig.colors.primary)[5]; // 500 shade
        const secondaryColor = Object.values(themeConfig.colors.secondary)[4]; // 400 shade
        const accentColor = Object.values(themeConfig.colors.accent)[4]; // 400 shade
        
        root.style.setProperty('--gradient-start', hexToRgba(primaryColor, 0.35));
        root.style.setProperty('--gradient-middle', hexToRgba(secondaryColor, 0.25));
        root.style.setProperty('--gradient-end', hexToRgba(accentColor, 0.15));
        root.style.setProperty('--gradient-accent', hexToRgba(accentColor, 0.4));
      } else {
        // Fallback subtle gradients
        root.style.setProperty('--gradient-start', 'rgba(255, 255, 255, 0.3)');
        root.style.setProperty('--gradient-middle', 'rgba(255, 255, 255, 0.2)');
        root.style.setProperty('--gradient-end', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--gradient-accent', 'rgba(255, 255, 255, 0.25)');
      }
      
      // Animation level mapping
      const animationMap = {
        none: '0ms',
        subtle: '200ms',
        enhanced: '300ms',
        premium: '500ms'
      };
      root.style.setProperty('--glass-transition', animationMap[effects.animationLevel || 'enhanced']);
      
      // Border intensity based on shadow level
      const borderMap = {
        light: 'rgba(255, 255, 255, 0.1)',
        medium: 'rgba(255, 255, 255, 0.18)',
        strong: 'rgba(255, 255, 255, 0.25)',
        ultra: 'rgba(255, 255, 255, 0.35)'
      };
      root.style.setProperty('--glass-border', borderMap[effects.shadowIntensity || 'strong']);
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
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

  // Apply theme to document root (OPTIMIZED for performance)
  useEffect(() => {
    // PERFORMANCE FIX: Use requestAnimationFrame to batch theme updates
    // This prevents blocking the main thread during large document theme changes
    requestAnimationFrame(() => {
      const themeConfig = themes[currentTheme];
      const root = document.documentElement;
      
      // OPTIMIZATION 1: Set data-theme attribute first for immediate CSS cascade
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      // OPTIMIZATION 2: Pre-calculate all CSS variables in a single batch
      const cssVariables: Array<[string, string]> = [];
      
      // Batch color variables (avoid individual DOM writes)
      Object.entries(themeConfig.colors).forEach(([colorGroup, shades]) => {
        Object.entries(shades).forEach(([shade, value]) => {
          // Convert hex to RGB values for CSS variables
          const hex = value.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          const rgbValue = `${r} ${g} ${b}`;
          
          // Batch the CSS variable assignments
          cssVariables.push([`--color-${colorGroup}-${shade}`, rgbValue]);
          cssVariables.push([`--color-${colorGroup}-${shade}-rgb`, rgbValue]);
        });
      });
      
      // OPTIMIZATION 3: Apply all CSS variables in one batch to minimize reflow
      cssVariables.forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    });

      // OPTIMIZATION 4: Batch glassmorphism effects in a separate animation frame
      // This prevents the main thread from being blocked by complex calculations
      requestAnimationFrame(() => {
        const themeConfig = themes[currentTheme];
        const root = document.documentElement;
        const effects = themeConfig.effects || {};
        
        if (effects.glassmorphism) {
          // Pre-calculate all glassmorphism variables in batches
          const glassVariables: Array<[string, string]> = [];
          
          // Basic glassmorphism variables
          glassVariables.push(['--glass-blur', effects.backdropBlur || '24px']);
          glassVariables.push(['--glass-opacity', effects.backgroundOpacity || '0.8']);
          
          // Shadow intensity mapping
          const shadowMap = {
            light: '0 4px 16px rgba(31, 38, 135, 0.2)',
            medium: '0 8px 32px rgba(31, 38, 135, 0.37)',
            strong: '0 12px 48px rgba(31, 38, 135, 0.5)',
            ultra: '0 16px 64px rgba(31, 38, 135, 0.7), 0 4px 16px rgba(31, 38, 135, 0.4)'
          };
          glassVariables.push(['--glass-shadow', shadowMap[effects.shadowIntensity || 'strong']]);
          
          // Generate gradient overlays efficiently
          if (effects.gradientOverlay) {
            // Helper function to convert hex to rgba (optimized)
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
            
            glassVariables.push(['--gradient-start', hexToRgba(primaryColor, 0.35)]);
            glassVariables.push(['--gradient-middle', hexToRgba(secondaryColor, 0.25)]);
            glassVariables.push(['--gradient-end', hexToRgba(accentColor, 0.15)]);
            glassVariables.push(['--gradient-accent', hexToRgba(accentColor, 0.4)]);
          } else {
            // Fallback subtle gradients
            glassVariables.push(['--gradient-start', 'rgba(255, 255, 255, 0.3)']);
            glassVariables.push(['--gradient-middle', 'rgba(255, 255, 255, 0.2)']);
            glassVariables.push(['--gradient-end', 'rgba(255, 255, 255, 0.1)']);
            glassVariables.push(['--gradient-accent', 'rgba(255, 255, 255, 0.25)']);
          }
          
          // Animation level mapping
          const animationMap = {
            none: '0ms',
            subtle: '200ms',
            enhanced: '300ms',
            premium: '500ms'
          };
          glassVariables.push(['--glass-transition', animationMap[effects.animationLevel || 'enhanced']]);
          
          // Border intensity based on shadow level
          const borderMap = {
            light: 'rgba(255, 255, 255, 0.1)',
            medium: 'rgba(255, 255, 255, 0.18)',
            strong: 'rgba(255, 255, 255, 0.25)',
            ultra: 'rgba(255, 255, 255, 0.35)'
          };
          glassVariables.push(['--glass-border', borderMap[effects.shadowIntensity || 'strong']]);
          
          // Apply all glassmorphism variables in one batch
          glassVariables.forEach(([property, value]) => {
            root.style.setProperty(property, value);
          });
        }
      });

      // OPTIMIZATION 5: Apply theme backgrounds in a final animation frame
      // This ensures the background changes happen after CSS variables are set
      requestAnimationFrame(() => {
        // Clear existing styles first
        document.body.style.cssText = '';
        
        // Pre-define ALL theme background styles for faster application
        const backgroundStyles = {
          professional: `
            background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 25%, #f8fafc  50%, #f1f5f9 75%, #e2e8f0 100%) !important;
            background-image: 
              linear-gradient(138deg, rgba(59, 130, 246, 0.35) 0%, rgba(147, 197, 253, 0.28) 22%, transparent 48%, rgba(219, 234, 254, 0.22) 73%, rgba(239, 246, 255, 0.15) 100%),
              radial-gradient(ellipse at 28% 18%, rgba(226, 232, 240, 0.25) 0%, transparent 52%),
              radial-gradient(ellipse at 78% 82%, rgba(203, 213, 225, 0.20) 0%, transparent 47%) !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: 100% 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `,
          bamboo: `
            background: linear-gradient(45deg, #2d5016 0%, #4a7c59 25%, #7ba05f 50%, #c5d4b8 75%, #f8faf5 100%) !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: 100% 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `,
          'apple-light': `
            background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 25%, #ffffff 50%, #f8fafc 75%, #e0f2fe 100%) !important;
            background-image: 
              radial-gradient(ellipse 650px 450px at 25% 15%, rgba(56, 189, 248, 0.32) 0%, transparent 60%),
              radial-gradient(ellipse 750px 300px at 75% 85%, rgba(125, 211, 252, 0.28) 0%, transparent 65%),
              radial-gradient(ellipse 400px 700px at 10% 50%, rgba(186, 230, 253, 0.25) 0%, transparent 55%),
              radial-gradient(ellipse 550px 400px at 90% 30%, rgba(224, 242, 254, 0.18) 0%, transparent 50%),
              radial-gradient(ellipse 300px 600px at 45% 95%, rgba(241, 245, 249, 0.25) 0%, transparent 45%),
              radial-gradient(ellipse 500px 250px at 70% 5%, rgba(226, 232, 240, 0.22) 0%, transparent 40%) !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: 100% 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `,
          'apple-dark': `
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
          `,
          kyoto: `
            background: linear-gradient(135deg, 
              #7A3D1A 0%,     /* Rich burnt sienna - left side */
              #9B4A1F 10%,    /* Deep rust */
              #C55A11 20%,    /* Burnt orange */
              #D97706 30%,    /* Amber 700 */
              #92400E 40%,    /* Amber 800 */
              #4A5D23 50%,    /* Olive brown - transition */
              #1E3A1E 60%,    /* Deep forest */
              #134E4A 70%,    /* Teal 800 */
              #0F766E 80%,    /* Teal 700 */
              #0D9488 90%,    /* Teal 600 */
              #14B8A6 100%    /* Teal 500 - right side */
            ) !important;
            background-image: 
              /* Enhanced texture overlays for depth */
              radial-gradient(ellipse 1000px 800px at 15% 25%, rgba(122, 61, 26, 0.6) 0%, rgba(155, 74, 31, 0.4) 25%, transparent 60%),
              radial-gradient(ellipse 800px 600px at 85% 75%, rgba(15, 118, 110, 0.5) 0%, rgba(13, 148, 136, 0.3) 35%, transparent 70%),
              radial-gradient(ellipse 600px 400px at 50% 10%, rgba(197, 90, 17, 0.4) 0%, rgba(217, 119, 6, 0.25) 40%, transparent 80%),
              radial-gradient(ellipse 700px 900px at 5% 85%, rgba(122, 61, 26, 0.3) 0%, rgba(155, 74, 31, 0.15) 50%, transparent 85%),
              radial-gradient(ellipse 500px 700px at 95% 45%, rgba(19, 78, 74, 0.4) 0%, rgba(15, 118, 110, 0.2) 45%, transparent 90%) !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: 100% 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `,
          'new-york': `
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
          `,
          autumn: `
            background-image: url('/images/autumn-background.jpg') !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: cover !important;
            background-position: center !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `
        };
        
        // Apply the theme-specific background style
        if (backgroundStyles[currentTheme]) {
          console.log(`🎨 THEME DEBUG: About to apply ${currentTheme} theme background`);
          console.log(`🎨 THEME DEBUG: Current body style before:`, document.body.style.cssText);
          
          document.body.style.cssText = backgroundStyles[currentTheme];
          
          console.log(`🎨 THEME DEBUG: Applied ${currentTheme} theme background`);
          console.log(`🎨 THEME DEBUG: CSS applied:`, backgroundStyles[currentTheme]);
          console.log(`🎨 THEME DEBUG: Body style after:`, document.body.style.cssText);
          
          // Check if styles are being overridden
          setTimeout(() => {
            console.log(`🎨 THEME DEBUG: Body style 100ms later:`, document.body.style.cssText);
            const computedStyle = window.getComputedStyle(document.body);
            console.log(`🎨 THEME DEBUG: Computed background:`, computedStyle.background);
            console.log(`🎨 THEME DEBUG: Computed backgroundImage:`, computedStyle.backgroundImage);
          }, 100);
        } else {
          // Fallback for unknown themes
          document.body.style.cssText = `
            background: #fafafa !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: 100% 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          `;
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Applied fallback background');
          }
        }
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
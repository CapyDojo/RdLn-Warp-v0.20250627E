/**
 * CSS Variable generation utilities for theme application
 */

import { ThemeConfig } from '../../types/theme';
import { hexToRgb, hexToRgba } from './colors';

/**
 * Generate CSS color variables from theme configuration
 */
export const generateColorVariables = (themeConfig: ThemeConfig): Array<[string, string]> => {
  const cssVariables: Array<[string, string]> = [];
  
  Object.entries(themeConfig.colors).forEach(([colorGroup, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      const rgbValue = hexToRgb(value);
      
      // Batch the CSS variable assignments
      cssVariables.push([`--color-${colorGroup}-${shade}`, rgbValue]);
      cssVariables.push([`--color-${colorGroup}-${shade}-rgb`, rgbValue]);
    });
  });

  // Add optimized button variables for fast theme switching
  const buttonVariables = generateButtonVariables(themeConfig);
  cssVariables.push(...buttonVariables);
  
  return cssVariables;
};

// Generate optimized button CSS variables for each theme
const generateButtonVariables = (themeConfig: ThemeConfig): Array<[string, string]> => {
  const themeName = themeConfig.name;
  const variables: Array<[string, string]> = [];
  
  // Define button color mappings per theme for optimal contrast
  const buttonMappings = {
    'professional': {
      primary: { bg: '#1e40af', border: '#1d4ed8', text: '#ffffff', hover: '#1e3a8a' },
      accent: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff', hover: '#b91c1c' },
      neutral: { bg: '#374151', border: '#4b5563', text: '#ffffff', hover: '#1f2937' },
      light: { bg: '#e2e8f0', border: '#cbd5e1', text: '#1e293b', hover: '#cbd5e1', hoverText: '#0f172a' },
      light2: { bg: '#cbd5e1', border: '#94a3b8', text: '#1e293b' }
    },
    'bamboo': {
      primary: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
      accent: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
      neutral: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
      light: { bg: '#f4f4f5', border: '#e4e4e7', text: '#1f2937', hover: '#e4e4e7', hoverText: '#111827' },
      light2: { bg: '#e4e4e7', border: '#d4d4d8', text: '#1f2937' }
    },
    'apple-dark': {
      primary: { bg: '#3b82f6', border: '#60a5fa', text: '#ffffff', hover: '#3b82f6' },
      accent: { bg: '#dc2626', border: '#ef4444', text: '#ffffff', hover: '#dc2626' },
      neutral: { bg: '#4b5563', border: '#6b7280', text: '#ffffff', hover: '#374151' },
      light: { bg: '#374151', border: '#4b5563', text: '#f9fafb', hover: '#4b5563', hoverText: '#ffffff' },
      light2: { bg: '#4b5563', border: '#6b7280', text: '#f9fafb' }
    },
    'kyoto': {
      primary: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
      accent: { bg: '#7f1d1d', border: '#991b1b', text: '#ffffff', hover: '#7f1d1d' },
      neutral: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
      light: { bg: '#44403c', border: '#57534e', text: '#fef7e6', hover: '#57534e', hoverText: '#ffffff' },
      light2: { bg: '#57534e', border: '#78716c', text: '#fef7e6' }
    },
    'new-york': {
      primary: { bg: '#1e40af', border: '#1d4ed8', text: '#ffffff', hover: '#1e3a8a' },
      accent: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff', hover: '#b91c1c' },
      neutral: { bg: '#374151', border: '#4b5563', text: '#ffffff', hover: '#1f2937' },
      light: { bg: '#374151', border: '#4b5563', text: '#f9fafb', hover: '#4b5563', hoverText: '#ffffff' },
      light2: { bg: '#4b5563', border: '#6b7280', text: '#f9fafb' }
    },
    'autumn': {
      primary: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
      accent: { bg: '#7f1d1d', border: '#991b1b', text: '#ffffff', hover: '#7f1d1d' },
      neutral: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
      light: { bg: '#e7e5e4', border: '#d6d3d1', text: '#1c1917', hover: '#d6d3d1', hoverText: '#0c0a09' },
      light2: { bg: '#d6d3d1', border: '#a8a29e', text: '#1c1917' }
    }
  };
  
  const mapping = buttonMappings[themeName as keyof typeof buttonMappings];
  if (mapping) {
    // Primary button variables
    variables.push(
      ['--button-primary-bg', mapping.primary.bg],
      ['--button-primary-border', mapping.primary.border],
      ['--button-primary-text', mapping.primary.text],
      ['--button-primary-hover', mapping.primary.hover]
    );
    
    // Accent button variables
    variables.push(
      ['--button-accent-bg', mapping.accent.bg],
      ['--button-accent-border', mapping.accent.border],
      ['--button-accent-text', mapping.accent.text],
      ['--button-accent-hover', mapping.accent.hover]
    );
    
    // Neutral button variables
    variables.push(
      ['--button-neutral-bg', mapping.neutral.bg],
      ['--button-neutral-border', mapping.neutral.border],
      ['--button-neutral-text', mapping.neutral.text],
      ['--button-neutral-hover', mapping.neutral.hover]
    );
    
    // Light button variables
    variables.push(
      ['--button-light-bg', mapping.light.bg],
      ['--button-light-border', mapping.light.border],
      ['--button-light-text', mapping.light.text],
      ['--button-light-hover', mapping.light.hover],
      ['--button-light-hover-text', mapping.light.hoverText || mapping.light.text]
    );
    
    // Light2 button variables
    variables.push(
      ['--button-light2-bg', mapping.light2.bg],
      ['--button-light2-border', mapping.light2.border],
      ['--button-light2-text', mapping.light2.text]
    );
  }
  
  return variables;
};

/**
 * Generate glassmorphism effect variables from theme configuration
 */
export const generateGlassmorphismVariables = (themeConfig: ThemeConfig): Array<[string, string]> => {
  const effects = themeConfig.effects || {};
  const glassVariables: Array<[string, string]> = [];
  
  if (!effects.glassmorphism) {
    return glassVariables;
  }
  
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
  
  return glassVariables;
};

/**
 * Apply CSS variables to document root efficiently
 */
export const applyCSSVariables = (variables: Array<[string, string]>): void => {
  const root = document.documentElement;
  variables.forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

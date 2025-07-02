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
  
  return cssVariables;
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

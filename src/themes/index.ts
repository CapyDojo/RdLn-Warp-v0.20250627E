/**
 * Main theme export file
 * Consolidates all themes and utilities for easy importing
 */

import { ThemeName, ThemeConfig } from '../types/theme';

// Import all theme definitions
import { professionalTheme } from './definitions/professional';
import { bambooTheme } from './definitions/bamboo';
import { appleLightTheme } from './definitions/apple-light';
import { appleDarkTheme } from './definitions/apple-dark';
import { kyotoTheme } from './definitions/kyoto';
import { newYorkTheme } from './definitions/new-york';
import { autumnTheme } from './definitions/autumn';

// Import utilities
export { hexToRgb, hexToRgba } from './utils/colors';
export { GLASSMORPHISM_EFFECTS } from './utils/effects';
export { backgroundStyles } from './backgrounds/styles';
export { generateColorVariables, generateGlassmorphismVariables, applyCSSVariables } from './utils/cssVariables';
export { isValidTheme, getSafeTheme, getThemeFromStorage } from './utils/validation';

/**
 * Master theme registry
 * All available themes in the application
 */
export const themes: Record<ThemeName, ThemeConfig> = {
  professional: professionalTheme,
  bamboo: bambooTheme,
  'apple-light': appleLightTheme,
  'apple-dark': appleDarkTheme,
  kyoto: kyotoTheme,
  'new-york': newYorkTheme,
  autumn: autumnTheme,
} as const;

// Export individual themes for direct access
export {
  professionalTheme,
  bambooTheme,
  appleLightTheme,
  appleDarkTheme,
  kyotoTheme,
  newYorkTheme,
  autumnTheme,
};

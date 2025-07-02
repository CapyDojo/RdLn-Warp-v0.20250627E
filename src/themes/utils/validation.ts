/**
 * Theme validation utilities
 */

import { ThemeName } from '../../types/theme';
import { themes } from '../index';

/**
 * Validates if a theme name is valid and available
 */
export const isValidTheme = (themeName: string): themeName is ThemeName => {
  return themeName in themes;
};

/**
 * Gets a safe theme name, falling back to default if invalid
 */
export const getSafeTheme = (themeName: string | null, fallback: ThemeName = 'professional'): ThemeName => {
  if (!themeName) return fallback;
  return isValidTheme(themeName) ? themeName : fallback;
};

/**
 * Gets theme from localStorage with validation
 */
export const getThemeFromStorage = (storageKey: string = 'rdln-theme'): ThemeName => {
  try {
    const savedTheme = localStorage.getItem(storageKey);
    return getSafeTheme(savedTheme);
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return 'professional';
  }
};

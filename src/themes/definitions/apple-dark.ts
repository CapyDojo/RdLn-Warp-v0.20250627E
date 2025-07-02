import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Apple Dark Theme
 * Sophisticated dark theme with Apple-inspired aesthetics.
 * Features inverted cool grays and vibrant purple accents for dark mode.
 */
export const appleDarkTheme: ThemeConfig = {
  name: 'apple-dark',
  displayName: 'Apple Dark',
  description: 'Sophisticated dark theme with Apple-inspired aesthetics',
  colors: {
    // Inverted cool gray primary palette - dark mode adaptation
    primary: {
      50: '#0c1929',   // Darkest as lightest for dark theme
      100: '#1e293b',  // Very dark cool gray
      200: '#334155',  // Dark cool gray
      300: '#475569',  // Medium-dark cool gray
      400: '#64748b',  // Medium cool gray
      500: '#94a3b8',  // Base cool gray - primary text on dark
      600: '#cbd5e1',  // Medium-light cool gray
      700: '#e2e8f0',  // Light cool gray
      800: '#f1f5f9',  // Very light cool gray
      900: '#f8fafc',  // Lightest cool gray
    },
    // Matching secondary palette for consistency
    secondary: {
      50: '#0f172a',   // Darkest secondary
      100: '#1e293b',  // Very dark secondary
      200: '#334155',  // Dark secondary
      300: '#475569',  // Medium-dark secondary
      400: '#64748b',  // Medium secondary
      500: '#94a3b8',  // Base secondary - readable text
      600: '#cbd5e1',  // Medium-light secondary
      700: '#e2e8f0',  // Light secondary
      800: '#f1f5f9',  // Very light secondary
      900: '#f8fafc',  // Lightest secondary
    },
    // Inverted purple accent palette - bright accents for dark theme
    accent: {
      50: '#4c1d95',   // Dark purple as base for dark theme
      100: '#5b21b6',  // Slightly lighter purple
      200: '#6d28d9',  // Medium-dark purple
      300: '#7c3aed',  // Medium purple
      400: '#8b5cf6',  // Medium-light purple
      500: '#a78bfa',  // Base purple - accent color for dark
      600: '#c4b5fd',  // Light purple
      700: '#ddd6fe',  // Very light purple
      800: '#ede9fe',  // Lightest purple
      900: '#f5f3ff',  // Palest purple tint
    },
    // True dark neutral palette - optimized for dark mode
    neutral: {
      50: '#000000',   // Pure black
      100: '#0a0a0a',  // Near black
      200: '#171717',  // Very dark neutral
      300: '#262626',  // Dark neutral
      400: '#404040',  // Medium-dark neutral
      500: '#525252',  // Medium neutral - body text on dark
      600: '#737373',  // Medium-light neutral
      700: '#a3a3a3',  // Light neutral - headings on dark
      800: '#d4d4d4',  // Very light neutral
      900: '#f5f5f5',  // Almost white
    },
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

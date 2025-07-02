import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Apple Light Theme
 * Clean, minimalist light theme inspired by Apple's design language.
 * Features bright sky blues, clean grays, and vibrant purple accents.
 */
export const appleLightTheme: ThemeConfig = {
  name: 'apple-light',
  displayName: 'Apple Light',
  description: 'Clean, minimalist light theme inspired by Apple design',
  colors: {
    // Sky blue primary palette - clean and modern
    primary: {
      50: '#f0f9ff',   // Lightest sky blue
      100: '#e0f2fe',  // Very light sky blue
      200: '#bae6fd',  // Light sky blue
      300: '#7dd3fc',  // Medium-light sky blue
      400: '#38bdf8',  // Medium sky blue
      500: '#0ea5e9',  // Base sky blue - primary brand color
      600: '#0284c7',  // Medium-dark sky blue
      700: '#0369a1',  // Dark sky blue
      800: '#075985',  // Darker sky blue
      900: '#0c4a6e',  // Darkest sky blue
    },
    // Cool gray secondary palette - supporting colors
    secondary: {
      50: '#f8fafc',   // Almost white with cool tint
      100: '#f1f5f9',  // Very light cool gray
      200: '#e2e8f0',  // Light cool gray
      300: '#cbd5e1',  // Medium-light cool gray
      400: '#94a3b8',  // Medium cool gray
      500: '#64748b',  // Base cool gray
      600: '#475569',  // Medium-dark cool gray
      700: '#334155',  // Dark cool gray
      800: '#1e293b',  // Darker cool gray
      900: '#0f172a',  // Darkest cool gray
    },
    // Vibrant purple accent palette - highlight colors
    accent: {
      50: '#fef7ff',   // Lightest purple tint
      100: '#fceeff',  // Very light purple
      200: '#f8daff',  // Light purple
      300: '#f2b8ff',  // Medium-light purple
      400: '#e879ff',  // Medium purple
      500: '#d946ef',  // Base purple - accent color
      600: '#c026d3',  // Medium-dark purple
      700: '#a21caf',  // Dark purple
      800: '#86198f',  // Darker purple
      900: '#701a75',  // Darkest purple
    },
    // Warm neutral palette - text and backgrounds
    neutral: {
      50: '#ffffff',   // Pure white
      100: '#f9fafb',  // Very light warm neutral
      200: '#f3f4f6',  // Light warm neutral
      300: '#e5e7eb',  // Medium-light warm neutral
      400: '#9ca3af',  // Medium warm neutral
      500: '#6b7280',  // Base warm neutral - body text
      600: '#4b5563',  // Medium-dark warm neutral
      700: '#374151',  // Dark warm neutral - headings
      800: '#1f2937',  // Darker warm neutral
      900: '#111827',  // Darkest warm neutral
    },
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

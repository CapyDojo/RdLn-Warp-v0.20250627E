import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Professional Blue Theme
 * Classic business theme with blue primary colors, neutral grays, and orange accents.
 * Perfect for corporate and professional environments.
 */
export const professionalTheme: ThemeConfig = {
  name: 'professional',
  displayName: 'Professional Blue',
  description: 'Classic professional theme with blue, white, and orange accents',
  colors: {
    // Blue primary palette - main brand colors
    primary: {
      50: '#eff6ff',   // Lightest blue tint
      100: '#dbeafe',  // Very light blue
      200: '#bfdbfe',  // Light blue
      300: '#93c5fd',  // Medium-light blue
      400: '#60a5fa',  // Medium blue
      500: '#3b82f6',  // Base blue - primary brand color
      600: '#2563eb',  // Medium-dark blue
      700: '#1d4ed8',  // Dark blue
      800: '#1e40af',  // Darker blue
      900: '#1e3c72',  // Darkest blue
    },
    // Neutral gray palette - supporting colors
    secondary: {
      50: '#f8fafc',   // Almost white
      100: '#f1f5f9',  // Very light gray
      200: '#e2e8f0',  // Light gray
      300: '#cbd5e1',  // Medium-light gray
      400: '#94a3b8',  // Medium gray
      500: '#64748b',  // Base gray
      600: '#475569',  // Medium-dark gray
      700: '#334155',  // Dark gray
      800: '#1e293b',  // Darker gray
      900: '#0f172a',  // Darkest gray
    },
    // Orange accent palette - highlight colors
    accent: {
      50: '#fff7ed',   // Lightest orange tint
      100: '#ffedd5',  // Very light orange
      200: '#fed7aa',  // Light orange
      300: '#fdba74',  // Medium-light orange
      400: '#fb923c',  // Medium orange
      500: '#ff6b35',  // Base orange - accent color
      600: '#ea580c',  // Medium-dark orange
      700: '#c2410c',  // Dark orange
      800: '#9a3412',  // Darker orange
      900: '#7c2d12',  // Darkest orange
    },
    // True neutral palette - text and backgrounds
    neutral: {
      50: '#fafafa',   // Pure white alternative
      100: '#f4f4f5',  // Very light neutral
      200: '#e4e4e7',  // Light neutral
      300: '#d4d4d8',  // Medium-light neutral
      400: '#a1a1aa',  // Medium neutral
      500: '#71717a',  // Base neutral - body text
      600: '#52525b',  // Medium-dark neutral
      700: '#3f3f46',  // Dark neutral - headings
      800: '#27272a',  // Darker neutral
      900: '#18181b',  // Darkest neutral
    },
  },
  effects: GLASSMORPHISM_EFFECTS.enhanced,
};

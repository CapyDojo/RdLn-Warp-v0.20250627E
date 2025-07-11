import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Autumn Theme
 * A theme inspired by the colors of autumn with warm earth tones,
 * deep forest greens, and rich maple reds.
 */
export const autumnTheme: ThemeConfig = {
  name: 'autumn',
  displayName: 'Autumn',
  description: 'A theme inspired by the colors of autumn.',
  colors: {
    // Deep Forest Green primary palette
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Autumn Maple Red secondary palette
    secondary: {
      50: '#fef2f2',
      100: '#fde8e8',
      200: '#fbd5d5',
      300: '#f8b4b4',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Warm Earth Tones accent palette
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Tatami & Stone neutral palette
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
  },
  // Semantic color mappings for autumn garden theme
  semanticColors: {
    // Text hierarchy - autumn garden inspired colors
    textBody: '#1c1917',           // Deepest charcoal for body text
    textHeader: '#14532d',         // Deepest forest green for headers
    textSecondary: '#44403c',      // Dark stone for secondary text
    textInteractive: '#ef4444',    // Medium-bright maple red for interactive elements
    textSuccess: '#15803d',        // Dark forest green for success states
    
    // Glass panels - light autumn colors with natural accents
    glassPanelBg: '#fafaf9',        // Light stone background
    glassPanelBorder: '#22c55e',    // Forest green border accents
    glassPanelShadow: '#f59e0b',    // Warm amber shadow
    glassPanelHover: '#fafaf9',     // Same as bg - hover managed by opacity
    glassPanelHoverShadow: '#22c55e', // Forest green hover shadow
    
    // Input fields - consistent with autumn theme
    inputBg: '#fafaf9',            // Light stone background
    inputBorder: '#22c55e',        // Forest green border
    inputFocus: '#ef4444',         // Maple red focus outline
    inputPlaceholder: '#78716c',   // Stone neutral placeholder
    
    // Button colors - autumn accent inspired
    buttonPrimary: '#22c55e',      // Forest green primary
    buttonSecondary: '#78716c',    // Stone neutral secondary
    buttonText: '#ffffff',         // White button text
    buttonHover: '#16a34a',        // Darker forest green hover
    
    // Resize handles - consistent with autumn aesthetic
    resizeHandleBg: '#fafaf9',           // Light stone background
    resizeHandleBorder: '#22c55e',       // Forest green border
    resizeHandleShadow: '#f59e0b',       // Warm amber shadow
    resizeHandleHoverBg: '#f5f5f4',      // Slightly darker stone hover
    resizeHandleHoverBorder: '#16a34a',  // Darker forest green hover border
    resizeHandleHoverShadow: '#22c55e',  // Forest green hover shadow
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Kyoto Zen Theme
 * Inspired by Japanese autumn gardens with vibrant maple reds and deep forest greens.
 * Features warm tatami backgrounds, autumn maple accents, and natural stone neutrals.
 */
export const kyotoTheme: ThemeConfig = {
  name: 'kyoto',
  displayName: 'Kyoto Afternoon',
  description: 'A dark, elegant theme inspired by a tranquil Kyoto night.',
  colors: {
    // Deep Forest Green primary palette - inverted for dark mode
    primary: {
      50: '#14532d',
      100: '#166534',
      200: '#15803d',
      300: '#16a34a',
      400: '#22c55e',
      500: '#4ade80',
      600: '#86efac',
      700: '#bbf7d0',
      800: '#dcfce7',
      900: '#f0fdf4',
    },
    // Autumn Maple Red secondary palette - inverted for dark mode
    secondary: {
      50: '#7f1d1d',
      100: '#991b1b',
      200: '#b91c1c',
      300: '#dc2626',
      400: '#ef4444',
      500: '#f87171',
      600: '#f8b4b4',
      700: '#fbd5d5',
      800: '#fde8e8',
      900: '#fef2f2',
    },
    // Warm Earth Tones accent palette - bamboo and gold
    accent: {
      50: '#fefdf8',   // Warm paper white
      100: '#fefbf3',  // Cream
      200: '#fef7e6',  // Light warm beige
      300: '#fdefd3',  // Medium beige
      400: '#fce4a6',  // Warm tan
      500: '#f5d563',  // Golden yellow - bamboo
      600: '#eab308',  // Rich gold
      700: '#ca8a04',  // Dark gold
      800: '#a16207',  // Bronze
      900: '#713f12',  // Deep bronze
    },
    // Tatami & Stone neutral palette - harmonized with peach theme
    neutral: {
      50: '#1c1917',
      100: '#292524',
      200: '#44403c',
      300: '#57534e',
      400: '#78716c',
      500: '#a8a29e',
      600: '#d6d3d1',
      700: '#e7e5e4',
      800: '#2c2825',  // Darker color for better text readability
      900: '#1f1e1b',  // Even darker for high contrast text
    },
  },
  // Semantic color mappings for Japanese-inspired dark theme
  semanticColors: {
    // Text hierarchy - Japanese garden inspired colors
    textBody: '#f8b4b4',           // Light maple peach for body text
    textHeader: '#86efac',         // Forest green for headers
    textSecondary: '#fef7e6',      // Tatami wheat for secondary text
    textInteractive: '#f8b4b4',    // Light maple red for interactive elements
    textSuccess: '#bbf7d0',        // Light forest green for success states
    
    // Glass panels - dark stone and earth tones
    glassPanelBg: '#1c1917',        // Dark tatami stone background
    glassPanelBorder: '#78716c',    // Stone neutral border
    glassPanelShadow: '#dc0808',    // Deep maple red shadow
    glassPanelHover: '#1c1917',     // Same as bg - hover managed by opacity
    glassPanelHoverShadow: '#dc0808', // Deep maple red hover shadow
    
    // Input fields - harmonized with theme
    inputBg: '#1c1917',            // Dark stone background
    inputBorder: '#78716c',        // Stone neutral border
    inputFocus: '#dc0808',         // Deep maple red focus
    inputPlaceholder: '#a8a29e',   // Neutral stone placeholder
    
    // Button colors - Japanese accent inspired
    buttonPrimary: '#dc0808',      // Deep maple red primary
    buttonSecondary: '#78716c',    // Stone neutral secondary
    buttonText: '#fef7e6',         // Tatami wheat text
    buttonHover: '#b91c1c',        // Darker maple hover
    
    // Resize handles - consistent with theme
    resizeHandleBg: '#1c1917',           // Dark stone background
    resizeHandleBorder: '#78716c',       // Stone neutral border
    resizeHandleShadow: '#dc0808',       // Deep maple red shadow
    resizeHandleHoverBg: '#292524',      // Slightly lighter stone hover
    resizeHandleHoverBorder: '#dc0808',  // Deep maple red hover border
    resizeHandleHoverShadow: '#b91c1c',  // Darker maple hover shadow
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

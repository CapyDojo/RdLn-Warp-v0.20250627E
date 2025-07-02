import { ThemeConfig } from '../../types/theme';

/**
 * Classic Dark Theme
 * A sophisticated dark mode theme inspired by modern desktop applications,
 * featuring dark grey backgrounds with light blue and orange accents.
 * Uses flat colors without gradients for a clean, professional appearance.
 */
export const classicDarkTheme: ThemeConfig = {
  name: 'classic-dark',
  displayName: 'Classic Dark',
  description: 'A dark theme with pure grey backgrounds, light blue and orange accents - inspired by modern productivity apps',
  colors: {
    // Light blue primary palette - for highlights and interactive elements
    primary: {
      50: '#f0f9ff',   // Very light blue tint
      100: '#e0f2fe',  // Light blue
      200: '#bae6fd',  // Medium-light blue
      300: '#7dd3fc',  // Medium blue
      400: '#38bdf8',  // Medium-bright blue
      500: '#0ea5e9',  // Base light blue - main accent
      600: '#0284c7',  // Medium-dark blue
      700: '#0369a1',  // Dark blue
      800: '#075985',  // Darker blue
      900: '#0c4a6e',  // Darkest blue
    },
    // Pure Grey palette - main interface colors
    secondary: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Orange accent palette - for warnings, highlights, and action items
    accent: {
      50: '#fff7ed',   // Very light orange tint
      100: '#ffedd5',  // Light orange
      200: '#fed7aa',  // Medium-light orange
      300: '#fdba74',  // Medium orange
      400: '#fb923c',  // Medium-bright orange
      500: '#f97316',  // Base orange - secondary accent
      600: '#ea580c',  // Medium-dark orange
      700: '#c2410c',  // Dark orange
      800: '#9a3412',  // Darker orange
      900: '#7c2d12',  // Darkest orange
    },
    // Pure neutral greys - for text and subtle backgrounds
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  // No glassmorphism effects - flat design as requested
  effects: {
    glassmorphism: false,
    backdropBlur: '0px',
    backgroundOpacity: '1',
    shadowIntensity: 'medium',
    gradientOverlay: false,
    animationLevel: 'subtle',
    textureOverlay: false,
  },
};

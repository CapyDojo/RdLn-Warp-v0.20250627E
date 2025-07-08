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
    // Pure Grey palette - main interface colors (optimized for dark mode readability)
    secondary: {
      50: '#fafafa',
      100: '#29405D',  // Dark blue-grey background for additions
      200: '#e5e5e5',
      300: '#1E2F42',  // Darker blue border for additions (darker than background)
      400: '#a3a3a3',
      500: '#737373',
      600: '#7BA8D6',  // Light blue decoration color for additions
      700: '#404040',
      800: '#f5f5f5',  // Light grey for text on dark backgrounds (additions)
      900: '#171717',
    },
    // Orange accent palette - for warnings, highlights, and action items (optimized for dark mode readability)
    accent: {
      50: '#fff7ed',   // Very light orange tint
      100: '#C13F17',  // Darker red-orange background for deletions
      200: '#fed7aa',  // Medium-light orange
      300: '#9A3012',  // Darker red border for deletions (darker than background)
      400: '#fb923c',  // Medium-bright orange
      500: '#f97316',  // Base orange - secondary accent
      600: '#F4804A',  // Orange decoration color for deletions (strikethrough)
      700: '#c2410c',  // Dark orange
      800: '#fbbf24',  // Light orange for text on dark backgrounds (deletions)
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
  // Semantic color mappings for classic dark theme
  semanticColors: {
    // Text hierarchy - dark theme with excellent contrast
    textBody: '#fafafa',           // Pure white for body text
    textHeader: '#ffffff',         // Pure white for headers
    textSecondary: '#a3a3a3',      // Pure medium gray for secondary
    textInteractive: '#fb923c',    // Orange accent for interactive
    textSuccess: '#38bdf8',        // Light blue for success/active
    
    // Glass panels - dark theme with orange accents
    glassPanelBg: '#262626',        // Dark gray background
    glassPanelBorder: '#f97316',    // Orange accent borders
    glassPanelShadow: '#f97316',    // Orange accent shadows
    glassPanelHover: '#262626',     // Same dark background for hover
    glassPanelHoverShadow: '#f97316', // Orange hover shadow
    
    // Input fields - consistent with dark theme
    inputBg: '#404040',            // Dark gray background
    inputBorder: '#f97316',        // Orange border
    inputFocus: '#f97316',         // Orange focus
    inputPlaceholder: '#a3a3a3',   // Medium gray placeholder
    
    // Button colors - keeping orange accents
    buttonPrimary: '#f97316',      // Orange primary
    buttonSecondary: '#737373',    // Gray secondary
    buttonText: '#ffffff',         // White button text
    buttonHover: '#fb923c',        // Lighter orange hover
    
    // Resize handles - keeping coherence with dark theme
    resizeHandleBg: '#262626',     // Dark gray for handle
    resizeHandleBorder: '#f97316', // Orange border for handle
    resizeHandleShadow: '#f97316', // Orange shadow for handle
    resizeHandleHoverBg: '#404040', // Lighter gray hover for handle
    resizeHandleHoverBorder: '#f97316', // Orange hover border
    resizeHandleHoverShadow: '#f97316', // Orange hover shadow
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

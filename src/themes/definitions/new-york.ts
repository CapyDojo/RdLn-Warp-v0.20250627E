import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * NYC Dusk Theme
 * A sophisticated dark theme inspired by a NYC skyline at night.
 * Features charcoal grays, warm amber accents, and electric blue highlights.
 */
export const newYorkTheme: ThemeConfig = {
  name: 'new-york',
  displayName: 'NYC Dusk',
  description: 'Urban night skyline with warm amber accents',
  colors: {
    primary: {
      50: '#ebebeb',
      100: '#d7d7d7',
      200: '#b0b0b0',
      300: '#888888',
      400: '#606060',
      500: '#404040',
      600: '#303030',
      700: '#202020',
      800: '#101010',
      900: '#000000',
    },
    secondary: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    },
    accent: {
      50: '#e0f7fa',
      100: '#b2ebf2',
      200: '#80deea',
      300: '#4dd0e1',
      400: '#26c6da',
      500: '#00bcd4',
      600: '#00acc1',
      700: '#0097a7',
      800: '#00838f',
      900: '#006064',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  // Semantic color mappings for NYC-inspired dark theme
  semanticColors: {
    // Text hierarchy - urban skyline inspired colors
    textBody: '#fafafa',           // Bright white for body text
    textHeader: '#ffffff',         // Pure white for headers
    textSecondary: '#e0e0e0',      // Light cool gray for secondary text
    textInteractive: '#ffb74d',    // Warm amber for interactive elements
    textSuccess: '#4dd0e1',        // Electric cyan for success states
    
    // Glass panels - dark urban colors with warm accents
    glassPanelBg: '#212121',        // Dark gray urban background
    glassPanelBorder: '#ff9800',    // Warm orange border accents
    glassPanelShadow: '#fb8c00',    // Rich orange shadow
    glassPanelHover: '#212121',     // Same as bg - hover managed by opacity
    glassPanelHoverShadow: '#ff9800', // Warm orange hover shadow
    
    // Input fields - consistent with urban theme
    inputBg: '#212121',            // Dark urban background
    inputBorder: '#ff9800',        // Warm orange border
    inputFocus: '#ffb74d',         // Amber focus outline
    inputPlaceholder: '#bdbdbd',   // Neutral gray placeholder
    
    // Button colors - NYC accent inspired
    buttonPrimary: '#ff9800',      // Warm orange primary
    buttonSecondary: '#757575',    // Neutral gray secondary
    buttonText: '#ffffff',         // White button text
    buttonHover: '#ffb74d',        // Amber hover state
    
    // Resize handles - consistent with urban aesthetic
    resizeHandleBg: '#212121',           // Dark urban background
    resizeHandleBorder: '#ff9800',       // Warm orange border
    resizeHandleShadow: '#fb8c00',       // Rich orange shadow
    resizeHandleHoverBg: '#424242',      // Slightly lighter urban hover
    resizeHandleHoverBorder: '#ffb74d',  // Amber hover border
    resizeHandleHoverShadow: '#ff9800',  // Warm orange hover shadow
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

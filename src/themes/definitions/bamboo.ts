import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * Bamboo Morning Theme
 * Serene nature-inspired theme with various shades of green and gold accents.
 * Enhanced contrast ratios for better accessibility.
 */
export const bambooTheme: ThemeConfig = {
  name: 'bamboo',
  displayName: 'Bamboo Morning',
  description: 'Serene bamboo green theme with glassmorphic effects',
  colors: {
    // Green primary palette - main nature colors
    primary: {
      50: '#f0f9f0',   // Lightest green tint
      100: '#dcf2dc',  // Very light green
      200: '#bae5ba',  // Light green
      300: '#8dd48d',  // Medium-light green
      400: '#5cb85c',  // Medium green
      500: '#3a9b3a',  // Base green - primary brand color
      600: '#2d7d2d',  // Medium-dark green
      700: '#256325',  // Dark green
      800: '#1f4f1f',  // Darker green
      900: '#1a3f1a',  // Darkest green
    },
    // Complementary green palette - supporting colors
    secondary: {
      50: '#f7fdf7',   // Softest green tint
      100: '#edfbed',  // Very light secondary green
      200: '#d3f5d3',  // Light secondary green
      300: '#aae8aa',  // Medium-light secondary green
      400: '#77d477',  // Medium secondary green
      500: '#4aba4a',  // Base secondary green
      600: '#359935',  // Medium-dark secondary green
      700: '#2b7a2b',  // Dark secondary green
      800: '#236123',  // Darker secondary green
      900: '#1d4f1d',  // Darkest secondary green
    },
    // Gold accent palette - highlight colors
    accent: {
      50: '#fefdf0',   // Lightest gold tint
      100: '#fdfad1',  // Very light gold
      200: '#fbf4a3',  // Light gold
      300: '#f7e96a',  // Medium-light gold
      400: '#f1d73a',  // Medium gold
      500: '#FF8C00',  // Dark orange - vibrant accent color
      600: '#250b01',  // Medium-dark gold
      700: '#1c0801',  // Dark gold
      800: '#130600',  // Darker gold
      900: '#0a0300',  // Darkest gold
    },
    // High-contrast neutral palette - optimized for readability
    neutral: {
      50: '#ffffff',   // Pure white for maximum contrast
      100: '#f8f9f8',  // Very light neutral with green hint
      200: '#e8ebe8',  // Light neutral with subtle green tint
      300: '#d0d5d0',  // Medium-light neutral
      400: '#8a948a',  // Medium neutral for better contrast
      500: '#5a645a',  // Darker neutral for readable text
      600: '#3d453d',  // Dark neutral for headings
      700: '#2a322a',  // Very dark for strong contrast
      800: '#FF8C00',  // Dark orange for input/output text
      900: '#0f140f',  // Almost black for ultimate contrast
    },
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
  // SSMR: Semantic color mappings - extracted from current CSS for pixel-perfect matching
  semanticColors: {
    // Text colors - exact matches from glassmorphism.css
    textBody: '#471e01',        // Extremely dark ochre - line 113, 119, 126, 140
    textHeader: '#471e01',      // Same dark ochre for headers - line 126
    textSecondary: '#44403c',   // Brown-gray - line 133
    textInteractive: '#471e01', // Same dark ochre for interactive elements - line 140
    textSuccess: '#256325',     // Rich green - line 145
    
    // Glass panel colors - using exact hardcoded values from CSS
    glassPanelBg: '#ffffff',           // White background - line 108
    glassPanelBorder: '#e8c41f',       // Golden bamboo border - rgba(232, 196, 31)
    glassPanelShadow: '#e8c41f',       // Golden bamboo shadow - rgba(232, 196, 31)
    glassPanelHover: '#f8f5f0',        // Light background on hover - rgba(248, 245, 240)
    glassPanelHoverShadow: '#f1ac1d',  // Hover shadow - rgba(241, 172, 29)
    
    // Input field colors - need to find in CSS or use defaults
    inputBg: '#ffffff',         // White background
    inputBorder: '#5d8a3a',     // Green border - rgba(93, 138, 58) from input field CSS
    inputFocus: '#5d8a3a',      // Green focus - same as border
    inputPlaceholder: '#2a322a', // Dark neutral for placeholder
    
    // Button colors - using theme colors
    buttonPrimary: '#3a9b3a',   // primary-500
    buttonSecondary: '#e8ebe8', // neutral-200
    buttonText: '#ffffff',      // White text
    buttonHover: '#2d7d2d',     // primary-600
    
    // Resize handle colors - using theme colors for consistency
    resizeHandleBg: '#bae5ba',   // primary-200
    resizeHandleBorder: '#256325', // primary-700 (dark green)
    resizeHandleShadow: '#256325', // primary-700 (dark green)
    resizeHandleHoverBg: '#8dd48d', // primary-300
    resizeHandleHoverBorder: '#256325', // primary-700 (dark green)
    resizeHandleHoverShadow: '#256325', // primary-700 (dark green)
  },
};

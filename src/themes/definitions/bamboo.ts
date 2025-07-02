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
      500: '#2e0e01',  // Base gold - accent color (extremely dark ochre)
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
      800: '#1a201a',  // Near black for maximum contrast
      900: '#0f140f',  // Almost black for ultimate contrast
    },
  },
  effects: GLASSMORPHISM_EFFECTS.premium,
};

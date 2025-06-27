import { ThemeConfig, ThemeName } from '../types/theme';

/**
 * Common glassmorphism effects configuration
 * Enhanced with more vivid and premium visual effects
 */
const GLASSMORPHISM_EFFECTS = {
  /** Standard glassmorphism with enhanced blur and vivid backgrounds */
  standard: {
    glassmorphism: true,
    backdropBlur: '16px',
    backgroundOpacity: '0.75',
    shadowIntensity: 'medium',
    gradientOverlay: true,
  },
  /** Premium glassmorphism with stronger effects for luxury feel */
  enhanced: {
    glassmorphism: true,
    backdropBlur: '24px',
    backgroundOpacity: '0.8',
    shadowIntensity: 'strong',
    gradientOverlay: true,
    animationLevel: 'enhanced',
  },
  /** Ultra premium glassmorphism for maximum visual impact */
  premium: {
    glassmorphism: true,
    backdropBlur: '32px',
    backgroundOpacity: '0.85',
    shadowIntensity: 'ultra',
    gradientOverlay: true,
    animationLevel: 'premium',
    textureOverlay: true,
  },
} as const;

/**
 * Color palette utility for consistent color generation
 */
const createColorPalette = (baseColors: Record<string, string>) => baseColors;

/**
 * Theme configurations for the document comparison application.
 * Each theme includes primary, secondary, accent, and neutral color palettes,
 * plus optional visual effects like glassmorphism.
 */
export const themes: Record<ThemeName, ThemeConfig> = {
  /**
   * Professional Blue Theme
   * Classic business theme with blue primary colors, neutral grays, and orange accents.
   * Perfect for corporate and professional environments.
   */
  professional: {
    name: 'professional',
    displayName: 'Professional Blue',
    description: 'Classic professional theme with blue, white, and orange accents',
    colors: {
      // Blue primary palette - main brand colors
      primary: createColorPalette({
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
      }),
      // Neutral gray palette - supporting colors
      secondary: createColorPalette({
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
      }),
      // Orange accent palette - highlight colors
      accent: createColorPalette({
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
      }),
      // True neutral palette - text and backgrounds
      neutral: createColorPalette({
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
      }),
    },
    effects: GLASSMORPHISM_EFFECTS.enhanced,
  },

  /**
   * Bamboo Green Theme
   * Serene nature-inspired theme with various shades of green and gold accents.
   * Enhanced contrast ratios for better accessibility.
   */
  bamboo: {
    name: 'bamboo',
    displayName: 'Bamboo Green',
    description: 'Serene bamboo green theme with glassmorphic effects',
    colors: {
      // Green primary palette - main nature colors
      primary: createColorPalette({
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
      }),
      // Complementary green palette - supporting colors
      secondary: createColorPalette({
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
      }),
      // Gold accent palette - highlight colors
      accent: createColorPalette({
        50: '#fefdf0',   // Lightest gold tint
        100: '#fdfad1',  // Very light gold
        200: '#fbf4a3',  // Light gold
        300: '#f7e96a',  // Medium-light gold
        400: '#f1d73a',  // Medium gold
        500: '#e8c41f',  // Base gold - accent color
        600: '#c89815',  // Medium-dark gold
        700: '#a06d15',  // Dark gold
        800: '#845517',  // Darker gold
        900: '#714619',  // Darkest gold
      }),
      // High-contrast neutral palette - optimized for readability
      neutral: createColorPalette({
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
      }),
    },
    effects: GLASSMORPHISM_EFFECTS.premium,
  },

  /**
   * Apple Light Theme
   * Clean, minimalist light theme inspired by Apple's design language.
   * Features bright sky blues, clean grays, and vibrant purple accents.
   */
  'apple-light': {
    name: 'apple-light',
    displayName: 'Apple Light',
    description: 'Clean, minimalist light theme inspired by Apple design',
    colors: {
      // Sky blue primary palette - clean and modern
      primary: createColorPalette({
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
      }),
      // Cool gray secondary palette - supporting colors
      secondary: createColorPalette({
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
      }),
      // Vibrant purple accent palette - highlight colors
      accent: createColorPalette({
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
      }),
      // Warm neutral palette - text and backgrounds
      neutral: createColorPalette({
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
      }),
    },
    effects: GLASSMORPHISM_EFFECTS.premium,
  },

  /**
   * Apple Dark Theme
   * Sophisticated dark theme with Apple-inspired aesthetics.
   * Features inverted cool grays and vibrant purple accents for dark mode.
   */
  'apple-dark': {
    name: 'apple-dark',
    displayName: 'Apple Dark',
    description: 'Sophisticated dark theme with Apple-inspired aesthetics',
    colors: {
      // Inverted cool gray primary palette - dark mode adaptation
      primary: createColorPalette({
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
      }),
      // Matching secondary palette for consistency
      secondary: createColorPalette({
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
      }),
      // Inverted purple accent palette - bright accents for dark theme
      accent: createColorPalette({
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
      }),
      // True dark neutral palette - optimized for dark mode
      neutral: createColorPalette({
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
      }),
    },
    effects: GLASSMORPHISM_EFFECTS.premium,
  },
} as const;

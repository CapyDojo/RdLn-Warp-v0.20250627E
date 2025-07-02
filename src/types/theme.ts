export type ThemeName = 'professional' | 'bamboo' | 'apple-light' | 'apple-dark' | 'kyoto' | 'new-york' | 'autumn' | 'classic-light' | 'classic-dark';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    // Primary colors
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    secondary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    accent: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  effects?: {
    glassmorphism?: boolean;
    backdropBlur?: string;
    backgroundOpacity?: string;
    shadowIntensity?: 'light' | 'medium' | 'strong' | 'ultra';
    gradientOverlay?: boolean;
    animationLevel?: 'none' | 'subtle' | 'enhanced' | 'premium';
    textureOverlay?: boolean;
  };
}
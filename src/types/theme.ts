export type ThemeName = 'professional' | 'bamboo' | 'apple-dark' | 'kyoto' | 'new-york' | 'autumn' | 'classic-light' | 'classic-dark';

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
  // SSMR: Semantic color mappings for consistent theme application
  semanticColors?: {
    // Text colors - map to specific theme shades for consistency
    textBody: string;           // Main body text
    textHeader: string;         // Headings (h1, h2, h3)
    textSecondary: string;      // Secondary/muted text
    textInteractive: string;    // Links, buttons, interactive elements
    textSuccess: string;        // Success states, active elements
    
    // Glass panel colors - unified glassmorphism styling
    glassPanelBg: string;       // Main panel background
    glassPanelBorder: string;   // Panel borders
    glassPanelShadow: string;   // Panel shadow colors
    glassPanelHover: string;    // Hover state background
    
    // Input field colors - form consistency
    inputBg: string;            // Input field backgrounds
    inputBorder: string;        // Input field borders
    inputFocus: string;         // Focus state colors
    inputPlaceholder: string;   // Placeholder text
    
    // Button colors - consistent interactive elements
    buttonPrimary: string;      // Primary button background
    buttonSecondary: string;    // Secondary button background
    buttonText: string;         // Button text color
    buttonHover: string;        // Button hover states
    
    // Resize handle colors - consistent resize element styling
    resizeHandleBg: string;           // Resize handle background
    resizeHandleBorder: string;       // Resize handle border
    resizeHandleShadow: string;       // Resize handle shadow
    resizeHandleHoverBg: string;      // Resize handle hover background
    resizeHandleHoverBorder: string;  // Resize handle hover border
    resizeHandleHoverShadow: string;  // Resize handle hover shadow
  };
}

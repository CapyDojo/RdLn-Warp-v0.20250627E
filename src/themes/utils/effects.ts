/**
 * Glassmorphism effects utility configuration
 */

export const GLASSMORPHISM_EFFECTS = {
  /** Standard effects with common blur and opacity */
  standard: {
    glassmorphism: true,
    backdropBlur: '16px',
    backgroundOpacity: '0.75',
    shadowIntensity: 'medium',
    gradientOverlay: true,
  },
  /** Enhanced effects for vivid visual experience */
  enhanced: {
    glassmorphism: true,
    backdropBlur: '24px',
    backgroundOpacity: '0.8',
    shadowIntensity: 'strong',
    gradientOverlay: true,
    animationLevel: 'enhanced',
  },
  /** Premium effects for maximum impact */
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

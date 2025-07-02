/**
 * Color utility functions for theme management
 */

/**
 * Converts a hex color to RGB values
 * @param hex - Hex color string (with or without #)
 * @returns RGB values as space-separated string (e.g., "255 128 0")
 */
export const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  return `${r} ${g} ${b}`;
};

/**
 * Converts a hex color to RGBA format
 * @param hex - Hex color string (with or without #)
 * @param alpha - Alpha value (0-1)
 * @returns RGBA string (e.g., "rgba(255, 128, 0, 0.5)")
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(1, 3), 16);
  const g = parseInt(cleanHex.slice(3, 5), 16);
  const b = parseInt(cleanHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

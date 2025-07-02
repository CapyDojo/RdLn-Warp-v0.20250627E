import { ThemeConfig } from '../../types/theme';
import { GLASSMORPHISM_EFFECTS } from '../utils/effects';

/**
 * New York Night Theme
 * A sophisticated dark theme inspired by a NYC skyline at night.
 * Features charcoal grays, warm amber accents, and electric blue highlights.
 */
export const newYorkTheme: ThemeConfig = {
  name: 'new-york',
  displayName: 'New York Night',
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
  effects: GLASSMORPHISM_EFFECTS.premium,
};

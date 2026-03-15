// src/theme/index.ts

export const COLORS = {
  // Gold & Black (default)
  gold: '#B8963E',
  goldLight: '#D4AF5A',
  goldDark: '#8A6E2A',
  goldMuted: 'rgba(184, 150, 62, 0.15)',
  goldBorder: 'rgba(184, 150, 62, 0.25)',

  // Backgrounds
  bg: '#0A0A0A',
  bg2: '#111111',
  bg3: '#141414',
  bg4: '#1A1A1A',
  bg5: '#1A1508',

  // Text
  textPrimary: '#F0ECE2',
  textSecondary: '#888888',
  textMuted: '#555555',

  // Borders
  border: 'rgba(255, 255, 255, 0.07)',
  borderLight: 'rgba(255, 255, 255, 0.12)',

  // Status
  success: '#5A9A5A',
  successBg: 'rgba(90, 154, 90, 0.12)',
  danger: '#C05050',
  dangerBg: 'rgba(192, 80, 80, 0.12)',
  warning: '#C9A84C',

  // UI
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const FONTS = {
  serif: 'CormorantGaramond-Light',
  serifRegular: 'CormorantGaramond-Regular',
  serifItalic: 'CormorantGaramond-LightItalic',
  sans: 'DMSans-Regular',
  sansLight: 'DMSans-Light',
  sansMedium: 'DMSans-Medium',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const SHADOWS = {
  gold: {
    shadowColor: '#B8963E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

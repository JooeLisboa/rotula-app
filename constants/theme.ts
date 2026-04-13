export type ThemeColors = {
  text: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  muted: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  success: string;
  warning: string;
  caution: string;
  danger: string;
};

export const Colors: Record<'light' | 'dark', ThemeColors> = {
  light: {
    text: '#14213D',
    background: '#F4F8F6',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FBF9',
    border: '#D7E3DC',
    muted: '#5F6B66',
    tint: '#20965B',
    icon: '#65706B',
    tabIconDefault: '#7A8680',
    tabIconSelected: '#20965B',
    success: '#1F9D55',
    warning: '#F2B11B',
    caution: '#EE7E2E',
    danger: '#DB3B2E',
  },
  dark: {
    text: '#ECF5EF',
    background: '#0F1713',
    surface: '#16211C',
    surfaceElevated: '#1A2620',
    border: '#2A3A33',
    muted: '#A6B6AE',
    tint: '#42C879',
    icon: '#9BA8A1',
    tabIconDefault: '#83928B',
    tabIconSelected: '#42C879',
    success: '#42C879',
    warning: '#F8C54B',
    caution: '#F19952',
    danger: '#FF6B5B',
  },
};

export const Palette = {
  primary: Colors.light.tint,
  primaryDark: '#177545',
  secondary: '#2D5BFF',
  bg: Colors.light.background,
  surface: Colors.light.surface,
  surfaceAlt: Colors.light.surfaceElevated,
  text: Colors.light.text,
  muted: Colors.light.muted,
  border: Colors.light.border,
  success: Colors.light.success,
  warning: Colors.light.warning,
  caution: Colors.light.caution,
  danger: Colors.light.danger,
};

export const ScoreColors = {
  excelente: '#1F9D55',
  bom: '#4CBF63',
  atencao: '#F2B11B',
  ruim: '#EE7E2E',
  evite: '#DB3B2E',
} as const;

export const spacing = {
  xxs: 2,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const typography = {
  caption: 12,
  body: 16,
  bodyLarge: 18,
  title: 28,
  titleLarge: 34,
};

export const Fonts = {
  rounded: 'System',
  mono: 'SpaceMono',
};

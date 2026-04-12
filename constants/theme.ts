type ThemeColors = {
  text: string;
  background: string;
  surface: string;
  border: string;
  muted: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export const Colors: Record<'light' | 'dark', ThemeColors> = {
  light: {
    text: '#111827',
    background: '#F6F8FB',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    muted: '#6B7280',
    tint: '#1F8A70',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#1F8A70',
  },
  dark: {
    text: '#ECEDEE',
    background: '#101214',
    surface: '#171A1D',
    border: '#2B3137',
    muted: '#9CA3AF',
    tint: '#34D399',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#34D399',
  },
};

export const Palette = {
  primary: '#1F8A70',
  primaryDark: '#146454',
  secondary: '#3D5AFE',
  bg: Colors.light.background,
  surface: Colors.light.surface,
  text: Colors.light.text,
  muted: Colors.light.muted,
  border: Colors.light.border,
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
};

export const ScoreColors = {
  excelente: '#15803D',
  bom: '#65A30D',
  atencao: '#D97706',
  ruim: '#DC2626',
  evite: '#7F1D1D',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Fonts = {
  rounded: 'System',
  mono: 'SpaceMono',
};

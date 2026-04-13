import { StyleSheet, Text, type TextProps } from 'react-native';

import { typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: typography.body,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: typography.body,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.titleLarge,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  link: {
    lineHeight: 24,
    fontSize: typography.body,
    color: '#1463FF',
    fontWeight: '600',
  },
  caption: {
    fontSize: typography.caption,
    lineHeight: 16,
  },
});

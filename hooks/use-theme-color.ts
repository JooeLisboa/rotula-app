/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeName = keyof typeof Colors;
type ThemeColorName = keyof (typeof Colors)['light'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const colorScheme = useColorScheme();
  const theme: ThemeName = colorScheme === 'dark' ? 'dark' : 'light';
  const colorFromProps = theme === 'dark' ? props.dark : props.light;

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName] ?? Colors.light[colorName];
}

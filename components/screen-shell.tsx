import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const mutedColor = useThemeColor({}, 'muted');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</ThemedText>
        ) : null}
        <View style={[styles.content, { backgroundColor: surfaceColor, borderColor }]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  subtitle: {},
  content: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});

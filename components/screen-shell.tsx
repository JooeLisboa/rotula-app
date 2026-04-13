import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { radius, spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">{title}</ThemedText>
          {subtitle ? (
            <ThemedText style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</ThemedText>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  header: {
    gap: spacing.xs,
    borderRadius: radius.lg,
  },
  subtitle: { lineHeight: 22 },
});

import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { radius, spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type SectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}> 
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      {subtitle ? <ThemedText style={{ color: mutedColor }}>{subtitle}</ThemedText> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  content: {
    gap: spacing.sm,
  },
});

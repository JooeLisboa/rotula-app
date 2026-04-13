import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { radius, spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}> 
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <ThemedText style={{ color: mutedColor }}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});

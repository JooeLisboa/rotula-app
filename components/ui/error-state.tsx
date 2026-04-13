import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, radius, spacing } from '@/constants/theme';

interface ErrorStateProps {
  title: string;
  description: string;
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
      <ThemedText>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#F3C9C4',
    backgroundColor: '#FFF5F4',
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: Palette.danger,
  },
});

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, radius, spacing } from '@/constants/theme';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Carregando informações...' }: LoadingStateProps) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="small" color={Palette.primary} />
      <ThemedText>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
});

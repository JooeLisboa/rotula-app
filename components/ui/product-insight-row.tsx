import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { spacing } from '@/constants/theme';
import { StatusDot } from '@/components/ui/status-dot';

interface ProductInsightRowProps {
  text: string;
  color: string;
}

export function ProductInsightRow({ text, color }: ProductInsightRowProps) {
  return (
    <View style={styles.row}>
      <StatusDot color={color} />
      <ThemedText style={styles.text}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  text: {
    flex: 1,
  },
});

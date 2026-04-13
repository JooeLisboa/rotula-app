import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScoreColors, spacing } from '@/constants/theme';
import type { ScoreClassification } from '@/src/types/product';

interface ScoreBadgeProps {
  score: number;
  classification: ScoreClassification;
  size?: 'md' | 'lg';
}

const classificationLabel: Record<ScoreClassification, string> = {
  excelente: 'Excelente',
  bom: 'Bom',
  atencao: 'Atenção',
  ruim: 'Ruim',
  evite: 'Evite',
};

export function ScoreBadge({ score, classification, size = 'md' }: ScoreBadgeProps) {
  const color = ScoreColors[classification];

  return (
    <View style={[styles.badge, { backgroundColor: color }, size === 'lg' && styles.large]}>
      <ThemedText style={[styles.score, size === 'lg' && styles.scoreLarge]}>{score}</ThemedText>
      <ThemedText style={styles.label}>{classificationLabel[classification]}</ThemedText>
      <ThemedText style={styles.caption}>de 100</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
    minWidth: 92,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 120,
  },
  score: { color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 34 },
  scoreLarge: {
    fontSize: 42,
    lineHeight: 44,
  },
  label: { color: '#fff', fontSize: 14, fontWeight: '700' },
  caption: { color: '#F9FAFB', fontSize: 11 },
});

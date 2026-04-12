import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScoreColors } from '@/constants/theme';
import type { ScoreClassification } from '@/src/types/product';

interface ScoreBadgeProps {
  score: number;
  classification: ScoreClassification;
}

export function ScoreBadge({ score, classification }: ScoreBadgeProps) {
  const color =
    ScoreColors[
      classification === 'atencao'
        ? 'atencao'
        : classification === 'excelente'
          ? 'excelente'
          : classification === 'bom'
            ? 'bom'
            : classification === 'ruim'
              ? 'ruim'
              : 'evite'
    ];

  return (
    <View style={[styles.badge, { backgroundColor: color }]}> 
      <ThemedText style={styles.score}>{score}</ThemedText>
      <ThemedText style={styles.label}>{classification.toUpperCase()}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  score: { color: '#fff', fontSize: 24, fontWeight: '700' },
  label: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

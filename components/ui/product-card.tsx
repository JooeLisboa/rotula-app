import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScoreBadge } from '@/components/ui/score-badge';
import { radius, spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Product } from '@/src/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Link href={`/product/${product.barcode}`} asChild>
      <Pressable style={styles.press}>
        <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}> 
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
              <ThemedText type="caption">{product.brand}</ThemedText>
            </View>
            <ScoreBadge score={product.score} classification={product.classification} />
          </View>
          <ThemedText numberOfLines={2}>{product.warnings[0] ?? 'Sem alertas críticos no momento.'}</ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: radius.lg },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});

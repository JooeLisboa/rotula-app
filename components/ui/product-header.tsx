import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { radius, spacing } from '@/constants/theme';
import type { Product } from '@/src/types/product';

interface ProductHeaderProps {
  product: Product;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: product.imageUrl ?? 'https://placehold.co/200x200/F0FDF4/14532D?text=Produto' }}
        style={styles.image}
        accessibilityLabel={`Imagem do produto ${product.name}`}
      />
      <View style={styles.meta}>
        <ThemedText type="subtitle">{product.name}</ThemedText>
        <ThemedText>{product.brand}</ThemedText>
        <ThemedText type="caption">{product.category.toUpperCase()}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  image: {
    width: 94,
    height: 94,
    borderRadius: radius.lg,
    backgroundColor: '#EEF7F1',
  },
  meta: {
    gap: spacing.xxs,
    flex: 1,
  },
});

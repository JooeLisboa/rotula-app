import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ScoreBadge } from '@/components/ui/score-badge';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { mockProducts } from '@/src/mocks/products';

export default function ProductResultScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const product = mockProducts.find((item) => item.barcode === barcode);

  if (!product) {
    return (
      <ScreenShell title="Produto não encontrado" subtitle="Quer contribuir? Envie fotos do rótulo.">
        <Link href="/not-found-product">
          <ThemedText>Ir para tela de contribuição</ThemedText>
        </Link>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={product.name} subtitle={`${product.brand} • ${product.category}`}>
      <ScoreBadge score={product.score} classification={product.classification} />

      <View style={styles.section}>
        <ThemedText type="subtitle">Pontos de atenção</ThemedText>
        {product.warnings.map((item) => (
          <ThemedText key={item}>• {item}</ThemedText>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Alternativas melhores</ThemedText>
        {product.alternatives.map((item) => (
          <ThemedText key={item.id}>{item.name} — nota {item.score}</ThemedText>
        ))}
      </View>

      <Link href="/compare">
        <ThemedText style={styles.link}>Comparar produtos</ThemedText>
      </Link>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section: { borderTopWidth: 1, borderTopColor: Palette.border, paddingTop: 10, gap: 4 },
  link: { color: Palette.secondary },
});

import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ScoreBadge } from '@/components/ui/score-badge';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { captureError, trackEvent } from '@/src/lib/observability/monitoring';
import { productsService } from '@/src/services/products/products-service';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';

export default function ProductResultScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!barcode) {
        setIsLoading(false);
        return;
      }

      try {
        const found = await productsService.findByBarcode(barcode);

        if (!mounted) {
          return;
        }

        setProduct(found);
        setIsLoading(false);

        if (found) {
          trackEvent('product_loaded', { productId: found.id, barcode });

          await userService.addScanHistory({
            barcode,
            productId: found.id,
            productName: found.name,
          });

          const favorites = await userService.getFavorites();
          if (mounted) {
            setIsFavorite(favorites.items.some((item) => item.id === found.id));
          }
        } else {
          trackEvent('product_not_found', { barcode });
        }
      } catch (error) {
        if (mounted) {
          setIsLoading(false);
        }

        captureError(error, { scope: 'screen.product.load', barcode });
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [barcode]);

  async function handleToggleFavorite() {
    if (!product || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);

    try {
      const favoriteState = await userService.toggleFavorite(product.id, product.barcode);
      setIsFavorite(favoriteState);
      trackEvent(favoriteState ? 'favorite_added' : 'favorite_removed', { productId: product.id });
    } catch (error) {
      captureError(error, { scope: 'screen.product.favorite', productId: product.id });
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  if (isLoading) {
    return (
      <ScreenShell title="Carregando produto" subtitle="Estamos buscando os dados mais recentes.">
        <ThemedText>Buscando informações...</ThemedText>
      </ScreenShell>
    );
  }

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

      <Pressable
        style={[styles.favoriteButton, isTogglingFavorite && styles.favoriteButtonDisabled]}
        onPress={handleToggleFavorite}
        disabled={isTogglingFavorite}
      >
        <ThemedText style={styles.favoriteLabel}>
          {isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        </ThemedText>
      </Pressable>

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
  favoriteButton: {
    borderRadius: 10,
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  favoriteButtonDisabled: { opacity: 0.7 },
  favoriteLabel: { color: '#fff', fontWeight: '700' },
});

import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProductCard } from '@/components/ui/product-card';
import { ScanCTA } from '@/components/ui/scan-cta';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';
import { captureError } from '@/src/lib/observability/monitoring';
import { productsService } from '@/src/services/products/products-service';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';
import type { HistoryEntry } from '@/src/types/user';

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Product | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([productsService.getFeatured(), userService.getHistory(), userService.getFavorites()])
      .then(([featuredProduct, historyResult, favoritesResult]) => {
        if (!mounted) {
          return;
        }
        setFeatured(featuredProduct);
        setHistory(historyResult.slice(0, 3));
        setFavorites(favoritesResult.items.slice(0, 2));
      })
      .catch((error) => {
        captureError(error, { scope: 'screen.home.overview' });
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenShell title="Olá!" subtitle="Escaneie, entenda e decida melhor em poucos segundos.">
      <ScanCTA />

      <SectionCard title="Busca manual" subtitle="Não encontrou a câmera? Digite o nome ou código.">
        <Link href="/(tabs)/search" asChild>
          <ThemedText type="link">Ir para busca inteligente</ThemedText>
        </Link>
      </SectionCard>

      <SectionCard title="Produto em destaque" subtitle="Uma análise completa para você explorar.">
        {isLoading ? (
          <LoadingState label="Atualizando recomendações..." />
        ) : featured ? (
          <ProductCard product={featured} />
        ) : (
          <EmptyState
            title="Ainda sem destaque"
            description="Assim que houver um produto em evidência, ele aparecerá aqui."
          />
        )}
      </SectionCard>

      <SectionCard title="Acesso rápido" subtitle="Continue de onde parou.">
        <View style={styles.quickLinks}>
          <Link href="/(tabs)/favorites" asChild>
            <ThemedText type="link">Favoritos ({favorites.length})</ThemedText>
          </Link>
          <Link href="/(tabs)/history" asChild>
            <ThemedText type="link">Histórico ({history.length})</ThemedText>
          </Link>
          <Link href="/scanner" asChild>
            <ThemedText type="link">Novo escaneamento</ThemedText>
          </Link>
        </View>
      </SectionCard>

      <SectionCard title="Dica rápida" subtitle="Como tirar mais proveito do app">
        <ThemedText>
          Sempre compare alternativas após cada escaneamento. Você melhora suas escolhas no dia a dia.
        </ThemedText>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  quickLinks: {
    gap: spacing.xs,
  },
});

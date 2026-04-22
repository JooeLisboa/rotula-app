import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProductHeader } from '@/components/ui/product-header';
import { ProductInsightRow } from '@/components/ui/product-insight-row';
import { ScoreBadge } from '@/components/ui/score-badge';
import { SectionCard } from '@/components/ui/section-card';
import { Palette, spacing } from '@/constants/theme';
import { useAuth } from '@/src/hooks/use-auth';
import { captureError, trackEvent } from '@/src/lib/observability/monitoring';
import { productsService } from '@/src/services/products/products-service';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';

export default function ProductResultScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { session } = useAuth();
  const uid = session?.user.id;
  const router = useRouter();
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
        const found = await productsService.getOrCreateProductByBarcode(barcode);

        if (!mounted) return;

        setProduct(found);
        setIsLoading(false);

        if (found && uid) {
          trackEvent('product_loaded', { productId: found.id, barcode });
          await userService.addScanToHistory(uid, barcode, found.name);
          const favorite = await userService.isFavorite(uid, found.barcode);
          if (mounted) {
            setIsFavorite(favorite);
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
  }, [barcode, uid]);

  async function handleToggleFavorite() {
    if (!product || !uid || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const favoriteState = await userService.toggleFavorite(uid, product.barcode);
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
      <ScreenShell title="Analisando produto" subtitle="Estamos carregando os detalhes da composição.">
        <LoadingState label="Buscando informações do rótulo..." />
      </ScreenShell>
    );
  }

  if (!product) {
    return (
      <ScreenShell title="Produto não encontrado" subtitle="Você pode contribuir para melhorar o catálogo.">
        <EmptyState
          title="Sem cadastro para este código"
          description="Tire fotos do rótulo para incluir esse item na base de análise."
        />
        <Link href={{ pathname: '/not-found-product', params: { barcode } }} asChild>
          <ThemedText type="link">Contribuir com este produto</ThemedText>
        </Link>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Resultado da análise" subtitle="Leitura clara para decidir rápido e com confiança.">
      <ProductHeader product={product} />

      <View accessible accessibilityLabel={`Nota geral ${product.score} de 100, classificação ${product.classification}`}>
        <ScoreBadge score={product.score} classification={product.classification} size="lg" />
      </View>

      <SectionCard title="Pontos de atenção" subtitle="Fatores que merecem cuidado">
        {product.warnings.length > 0 ? (
          product.warnings.map((item) => <ProductInsightRow key={item} text={item} color={Palette.danger} />)
        ) : (
          <ThemedText>Sem alertas críticos identificados.</ThemedText>
        )}
      </SectionCard>

      <SectionCard title="Pontos positivos" subtitle="Aspectos favoráveis deste produto">
        {product.positives.length > 0 ? (
          product.positives.map((item) => <ProductInsightRow key={item} text={item} color={Palette.success} />)
        ) : (
          <ThemedText>Nenhum destaque positivo informado.</ThemedText>
        )}
      </SectionCard>

      <SectionCard title="Composição" subtitle="Ingredientes críticos ou relevantes">
        {product.criticalIngredients.length > 0 ? (
          product.criticalIngredients.map((item) => <ProductInsightRow key={item} text={item} color={Palette.warning} />)
        ) : (
          <ThemedText>Não há ingredientes críticos cadastrados para este item.</ThemedText>
        )}
      </SectionCard>

      <View style={styles.actions}>
        <ActionButton
          label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          onPress={handleToggleFavorite}
          disabled={isTogglingFavorite || !uid}
          variant="primary"
        />
        <ActionButton label="Escanear outro produto" onPress={() => router.push('/scanner')} variant="secondary" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.sm },
});

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
import { EventName, trackEvent } from '@/src/analytics/events';
import { useAuth } from '@/src/hooks/use-auth';
import { useLanguage } from '@/src/hooks/use-language';
import { captureError } from '@/src/lib/observability/monitoring';
import { productsService } from '@/src/services/products/products-service';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';

export default function ProductResultScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { session } = useAuth();
  const { t } = useLanguage();
  const uid = session?.user.id;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      if (!barcode) return setIsLoading(false);
      try {
        const found = await productsService.getOrCreateProductByBarcode(barcode);
        if (!mounted) return;
        setProduct(found); setIsLoading(false);
        if (found && uid) {
          trackEvent(EventName.ProductLoaded, { source: 'barcode' });
          await userService.addScanToHistory(uid, barcode, found.name);
          const favorite = await userService.isFavorite(uid, found.barcode);
          if (mounted) setIsFavorite(favorite);
        } else { trackEvent(EventName.ProductNotFound); }
      } catch (error) { if (mounted) setIsLoading(false); captureError(error, { scope: 'screen.product.load' }); }
    }
    loadProduct(); return () => { mounted = false; };
  }, [barcode, uid]);

  async function handleToggleFavorite() {
    if (!product || !uid || isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    try { const favoriteState = await userService.toggleFavorite(uid, product.barcode); setIsFavorite(favoriteState); trackEvent(favoriteState ? EventName.FavoriteAdded : EventName.FavoriteRemoved); }
    catch (error) { captureError(error, { scope: 'screen.product.favorite' }); }
    finally { setIsTogglingFavorite(false); }
  }

  if (isLoading) return <ScreenShell title={t('product.loadingTitle')} subtitle={t('product.loadingSubtitle')}><LoadingState label={t('product.loadingLabel')} /></ScreenShell>;

  if (!product) return <ScreenShell title={t('product.notFoundTitle')} subtitle={t('product.notFoundSubtitle')}><EmptyState title={t('product.notFoundEmptyTitle')} description={t('product.notFoundEmptyDescription')} /><ActionButton label={t('product.scanAgainAction')} onPress={() => router.push('/scanner')} variant="secondary" /><ActionButton label={t('product.searchAction')} onPress={() => router.push('/(tabs)/search')} variant="secondary" /><Link href={{ pathname: '/not-found-product', params: { barcode } }} asChild><ThemedText type="link">{t('product.contribute')}</ThemedText></Link></ScreenShell>;

  return <ScreenShell title={t('product.resultTitle')} subtitle={t('product.resultSubtitle')}><ProductHeader product={product} /><View accessible accessibilityLabel={`Score ${product.score}/100 ${product.classification}`}><ScoreBadge score={product.score} classification={product.classification} size="lg" /></View><SectionCard title={t('product.warningsTitle')} subtitle={t('product.warningsSubtitle')}>{product.warnings.length > 0 ? product.warnings.map((item) => <ProductInsightRow key={item} text={item} color={Palette.danger} />) : <ThemedText>{t('product.noWarnings')}</ThemedText>}</SectionCard><SectionCard title={t('product.positivesTitle')} subtitle={t('product.positivesSubtitle')}>{product.positives.length > 0 ? product.positives.map((item) => <ProductInsightRow key={item} text={item} color={Palette.success} />) : <ThemedText>{t('product.noPositives')}</ThemedText>}</SectionCard><SectionCard title={t('product.compositionTitle')} subtitle={t('product.compositionSubtitle')}>{product.criticalIngredients.length > 0 ? product.criticalIngredients.map((item) => <ProductInsightRow key={item} text={item} color={Palette.warning} />) : <ThemedText>{t('product.noCritical')}</ThemedText>}</SectionCard><View style={styles.actions}><ActionButton label={isFavorite ? t('product.removeFavorite') : t('product.saveFavorite')} onPress={handleToggleFavorite} disabled={isTogglingFavorite || !uid} variant="primary" /><ActionButton label={t('product.scanAnother')} onPress={() => router.push('/scanner')} variant="secondary" /></View></ScreenShell>;
}

const styles = StyleSheet.create({ actions: { gap: spacing.sm } });

import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProductCard } from '@/components/ui/product-card';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';
import { CommercialCTA } from '@/src/components/commercial-cta';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';
import { productsService } from '@/src/services/products/products-service';
import type { Product } from '@/src/types/product';

export default function HomeScreen() {
  const { t } = useLanguage(); const router = useRouter();
  const [featured, setFeatured] = useState<Product | null>(null); const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { productsService.getFeatured().then(setFeatured).finally(() => setIsLoading(false)); }, []);
  return <ScreenShell title={t('home.title')} subtitle={t('home.subtitle')}>
    <CommercialCTA title={t('cta.premiumTitle')} description={t('cta.premiumDescription')} buttonLabel={t('cta.premiumButton')} onPress={() => { trackEvent(EventName.CtaClicked, { source: 'home' }); router.push('/scanner'); }} />
    <SectionCard title={t('home.manualSearch')} subtitle={t('search.subtitle')}><Link href="/(tabs)/search" asChild><ThemedText type="link">{t('common.understandProduct')}</ThemedText></Link></SectionCard>
    <SectionCard title={t('home.featured')} subtitle={t('home.methodology')}>{isLoading ? <LoadingState label={t('common.loading')} /> : featured ? <ProductCard product={featured} /> : <EmptyState title={t('home.featured')} description={t('search.empty')} />}</SectionCard>
    <SectionCard title={t('home.quickAccess')} subtitle={t('home.socialProof')}><View style={styles.quickLinks}><Link href="/(tabs)/favorites" asChild><ThemedText type="link">Favoritos</ThemedText></Link><Link href="/(tabs)/history" asChild><ThemedText type="link">Histórico</ThemedText></Link><Link href="/faq" asChild><ThemedText type="link">FAQ</ThemedText></Link></View></SectionCard>
  </ScreenShell>;
}
const styles = StyleSheet.create({ quickLinks: { gap: spacing.xs } });

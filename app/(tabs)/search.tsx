import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/ui/product-card';
import { ActionButton } from '@/components/ui/action-button';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';
import { productsService } from '@/src/services/products/products-service';
import type { Product } from '@/src/types/product';

export default function SearchScreen() {
  const { t } = useLanguage(); const [query, setQuery] = useState(''); const [results, setResults] = useState<Product[]>([]);
  const handleSearch = async () => { trackEvent(EventName.ProductSearchStarted, { query }); setResults(await productsService.searchByName(query)); };
  return <ScreenShell title={t('search.title')} subtitle={t('search.subtitle')}><View style={styles.searchRow}><TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder={t('search.placeholder')} /><ActionButton label={t('common.understandProduct')} onPress={handleSearch} /></View>{results.length === 0 ? <EmptyState title={t('search.title')} description={t('search.empty')} /> : results.map((item) => <ProductCard key={item.id} product={item} />)}</ScreenShell>;
}
const styles = StyleSheet.create({ searchRow: { gap: spacing.sm }, input: { borderWidth: 1, borderColor: Palette.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: Palette.surface, minHeight: 48, color: Palette.text } });

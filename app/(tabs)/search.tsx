import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/ui/product-card';
import { ActionButton } from '@/components/ui/action-button';
import { Palette, radius, spacing } from '@/constants/theme';
import { productsService } from '@/src/services/products/products-service';
import type { Product } from '@/src/types/product';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async () => {
    const result = await productsService.searchByName(query);
    setResults(result);
  };

  return (
    <ScreenShell title="Busca manual" subtitle="Procure por nome para abrir a análise do produto.">
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Ex: granola sem açúcar"
          accessibilityLabel="Campo de busca por nome do produto"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <ActionButton label="Buscar" onPress={handleSearch} />
      </View>

      {results.length === 0 ? (
        <EmptyState
          title="Digite para buscar"
          description="Você pode pesquisar por nome, depois abrir o resultado completo."
        />
      ) : (
        results.map((item) => <ProductCard key={item.id} product={item} />)
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  searchRow: { gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    minHeight: 48,
  },
});

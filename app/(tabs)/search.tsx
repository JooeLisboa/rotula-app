import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { productService } from '@/src/services/product-service';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [firstBarcode, setFirstBarcode] = useState<string | null>(null);

  const handleSearch = async () => {
    const result = await productService.searchByName(query);
    setFirstBarcode(result[0]?.barcode ?? null);
  };

  return (
    <ScreenShell title="Busca manual" subtitle="Não achou no scanner? Busque pelo nome.">
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Ex: granola" />
      <Pressable onPress={handleSearch} style={styles.button}>
        <ThemedText style={styles.buttonText}>Buscar</ThemedText>
      </Pressable>

      {firstBarcode ? (
        <Link href={`/product/${firstBarcode}`}>
          <ThemedText style={styles.link}>Ver primeiro resultado</ThemedText>
        </Link>
      ) : (
        <ThemedText style={styles.empty}>Nenhum resultado ainda.</ThemedText>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: Palette.border, borderRadius: 10, padding: 12 },
  button: { backgroundColor: Palette.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { color: Palette.secondary },
  empty: { color: Palette.muted },
});

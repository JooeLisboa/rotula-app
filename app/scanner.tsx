import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { trackEvent } from '@/src/lib/observability/monitoring';

export default function ScannerScreen() {
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedBarcode = useMemo(() => barcode.trim(), [barcode]);
  const canSubmit = normalizedBarcode.length >= 8 && !isSubmitting;

  async function handleScan() {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    trackEvent('barcode_scanned', { barcode: normalizedBarcode, mode: 'manual' });
    router.push(`/product/${normalizedBarcode}`);
    setTimeout(() => setIsSubmitting(false), 400);
  }

  return (
    <ScreenShell
      title="Scanner"
      subtitle="Leitura em modo manual (fallback). A integração por câmera está preparada para plugar módulo nativo."
    >
      <View style={styles.card}>
        <ThemedText type="subtitle">Digite ou cole o código de barras</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Ex.: 7891000100103"
        />
        <Pressable
          onPress={handleScan}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          disabled={!canSubmit}
        >
          <ThemedText style={styles.buttonText}>{isSubmitting ? 'Analisando...' : 'Analisar código'}</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.hint}>
        Dica: para validar fluxo completo use os códigos dos mocks, como 7891000100103.
      </ThemedText>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderColor: Palette.border,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: { backgroundColor: Palette.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' },
  hint: { color: Palette.secondary },
});

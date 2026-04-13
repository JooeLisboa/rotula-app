import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { SectionCard } from '@/components/ui/section-card';
import { Palette, radius, spacing } from '@/constants/theme';
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
    <ScreenShell title="Scanner" subtitle="Modo manual para leitura rápida do código de barras.">
      <SectionCard title="Digite ou cole o código" subtitle="Recomendado para testar fluxo e encontrar produtos.">
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Ex.: 7891000100103"
          accessibilityLabel="Campo para código de barras"
        />
        <ActionButton
          onPress={handleScan}
          disabled={!canSubmit}
          label={isSubmitting ? 'Analisando...' : 'Analisar produto'}
        />
      </SectionCard>

      <View style={styles.tipBox}>
        <ThemedText type="defaultSemiBold">Dica</ThemedText>
        <ThemedText>Use códigos cadastrados na sua base Firebase para validar a experiência completa.</ThemedText>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  tipBox: {
    borderWidth: 1,
    borderColor: '#CFE4D8',
    borderRadius: radius.lg,
    backgroundColor: '#F2FAF6',
    padding: spacing.md,
    gap: spacing.xs,
  },
});

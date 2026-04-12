import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function ScannerScreen() {
  const sampleBarcode = '7891000100103';

  return (
    <ScreenShell title="Scanner" subtitle="Aponte para o código de barras ou digite manualmente.">
      <TextInput style={styles.input} value={sampleBarcode} editable={false} />
      <Link href="/scan-loading" asChild>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonText}>Simular leitura</ThemedText>
        </Pressable>
      </Link>
      <Link href="/camera-permission">
        <ThemedText style={styles.link}>Permissão de câmera</ThemedText>
      </Link>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: Palette.border, borderRadius: 10, padding: 12 },
  button: { backgroundColor: Palette.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { color: Palette.secondary },
});

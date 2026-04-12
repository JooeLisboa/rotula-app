import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function OnboardingScreen() {
  return (
    <ScreenShell title="Rótula" subtitle="Escaneie, entenda e escolha melhor em segundos.">
      <ThemedText>Analise alimentos, cosméticos, higiene e autocuidado com nota clara.</ThemedText>
      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonLabel}>Começar</ThemedText>
        </Pressable>
      </Link>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    backgroundColor: Palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: { color: '#fff', fontWeight: '600' },
});

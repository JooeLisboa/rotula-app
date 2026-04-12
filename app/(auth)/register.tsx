import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <ScreenShell title="Criar conta" subtitle="Comece grátis e acompanhe suas escolhas.">
      <TextInput placeholder="Nome" style={styles.input} />
      <TextInput placeholder="E-mail" style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonLabel}>Cadastrar</ThemedText>
        </Pressable>
      </Link>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    backgroundColor: Palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: { color: '#fff', fontWeight: '700' },
});

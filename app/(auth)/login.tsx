import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <ScreenShell title="Entrar" subtitle="Use seu e-mail para acessar histórico e favoritos.">
      <TextInput placeholder="E-mail" style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonLabel}>Entrar</ThemedText>
        </Pressable>
      </Link>
      <Link href="/(auth)/register">
        <ThemedText style={styles.link}>Criar conta</ThemedText>
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
  link: { color: Palette.secondary, marginTop: 8 },
});

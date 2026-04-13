import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticating } = useAuth();
  const [email, setEmail] = useState('demo@rotula.app');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (authError) {
      captureError(authError, { scope: 'screen.login' });
      setError(authError instanceof Error ? authError.message : 'Erro ao autenticar.');
    }
  }

  return (
    <ScreenShell title="Entrar" subtitle="Use seu e-mail para acessar histórico e favoritos.">
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <Pressable style={[styles.button, isAuthenticating && styles.buttonDisabled]} onPress={handleLogin}>
        <ThemedText style={styles.buttonLabel}>{isAuthenticating ? 'Entrando...' : 'Entrar'}</ThemedText>
      </Pressable>
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
  buttonDisabled: { opacity: 0.7 },
  buttonLabel: { color: '#fff', fontWeight: '700' },
  link: { color: Palette.secondary, marginTop: 8 },
  error: { color: '#b00020' },
});

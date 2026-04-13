import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isAuthenticating } = useAuth();
  const [name, setName] = useState('Usuário Demo');
  const [email, setEmail] = useState('demo@rotula.app');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (authError) {
      captureError(authError, { scope: 'screen.register' });
      setError(authError instanceof Error ? authError.message : 'Erro ao cadastrar.');
    }
  }

  return (
    <ScreenShell title="Criar conta" subtitle="Comece grátis e acompanhe suas escolhas.">
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
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
      <Pressable style={[styles.button, isAuthenticating && styles.buttonDisabled]} onPress={handleRegister}>
        <ThemedText style={styles.buttonLabel}>{isAuthenticating ? 'Criando conta...' : 'Cadastrar'}</ThemedText>
      </Pressable>
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
  error: { color: '#b00020' },
});

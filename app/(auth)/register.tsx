import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { Palette, radius, spacing } from '@/constants/theme';

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
    <ScreenShell title="Criar conta" subtitle="Comece grátis e acompanhe suas escolhas com clareza.">
      <View style={styles.form}>
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
      </View>
      {error ? <ErrorState title="Falha no cadastro" description={error} /> : null}
      <ActionButton
        label={isAuthenticating ? 'Criando conta...' : 'Cadastrar'}
        onPress={handleRegister}
        disabled={isAuthenticating}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    minHeight: 48,
  },
});

import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { Palette, radius, spacing } from '@/constants/theme';

type AppError = Error & { code?: string; originalMessage?: string };

function toScreenMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro ao autenticar.';
}

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
      const detailedError = authError as AppError;

      captureError(authError, {
        scope: 'screen.login',
        code: detailedError.code,
        firebaseMessage: detailedError.originalMessage,
      });

      setError(toScreenMessage(authError));
    }
  }

  return (
    <ScreenShell title="Entrar" subtitle="Acesse seus favoritos, histórico e recomendações personalizadas.">
      <View style={styles.form}>
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Campo de e-mail"
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Campo de senha"
        />
      </View>
      {error ? <ErrorState title="Falha no login" description={error} /> : null}
      <ActionButton label={isAuthenticating ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={isAuthenticating} />
      <Link href="/(auth)/register" asChild>
        <ThemedText type="link">Criar conta grátis</ThemedText>
      </Link>
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

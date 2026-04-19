import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { ActionButton } from "@/components/ui/action-button";
import { ErrorState } from "@/components/ui/error-state";
import { Palette, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/src/hooks/use-auth";
import { captureError } from "@/src/lib/observability/monitoring";

type AppError = Error & { code?: string; originalMessage?: string };

function toScreenMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro ao autenticar.";
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticating } = useAuth();
  const [email, setEmail] = useState("demo@rotula.app");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    try {
      await login({ email: email.trim(), password });
      router.replace("/(tabs)");
    } catch (authError) {
      const detailedError = authError as AppError;

      captureError(authError, {
        scope: "screen.login",
        code: detailedError.code,
        firebaseMessage: detailedError.originalMessage,
      });

      setError(toScreenMessage(authError));
    }
  }

  return (
    <ScreenShell
      title="Bem-vindo de volta"
      subtitle="Acesse seus favoritos, histórico e recomendações personalizadas."
    >
      <View style={styles.container}>
        {/* Bloco do Formulário */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              color={Palette.muted}
              style={styles.icon}
            />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor={Palette.muted}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Campo de e-mail"
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={22}
              color={Palette.muted}
              style={styles.icon}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor={Palette.muted}
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Campo de senha"
            />
          </View>

          {error ? (
            <ErrorState title="Falha no login" description={error} />
          ) : null}
        </View>

        {/* Rodapé fixado na base */}
        <View style={styles.footer}>
          <ActionButton
            label={isAuthenticating ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            disabled={isAuthenticating}
          />

          <View style={styles.registerContainer}>
            <ThemedText type="caption" style={{ color: Palette.muted }}>
              Ainda não tem uma conta?
            </ThemedText>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.registerTouch}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: Palette.primary }}
                >
                  Criar conta grátis
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 52,
    color: Palette.text,
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
    gap: spacing.lg,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  registerTouch: {
    padding: spacing.xxs,
  },
});

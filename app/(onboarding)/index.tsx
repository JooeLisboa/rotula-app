import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { ThemedText } from "@/components/themed-text";
import { ActionButton } from "@/components/ui/action-button";
import { Palette, radius, spacing } from "@/constants/theme";

// Subcomponente para organizar os benefícios visualmente
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.iconBadge}>
        <MaterialCommunityIcons name={icon} size={24} color={Palette.primary} />
      </View>
      <View style={styles.featureText}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="caption">{description}</ThemedText>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Bem-vindo"
      subtitle="Escaneie e entenda melhor seus produtos"
    >
      <View style={styles.container}>
        {/* Seção Hero: Destaque visual inicial */}
        <View style={styles.hero}>
          <View style={styles.heroLogo}>
            {/* Substituímos o ícone pela sua imagem PNG */}
            <Image
              source={require("@/assets/images/ruli.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </View>
          <ThemedText type="title" style={styles.title}>
            Decisões mais saudáveis.
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Escaneie produtos, entenda os rótulos em segundos e descubra
            alternativas melhores para o seu dia a dia.
          </ThemedText>
        </View>

        {/* Proposta de Valor Escaneável */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="barcode-scan"
            title="Leitura instantânea"
            description="Basta apontar a câmera para o código de barras."
          />
          <FeatureItem
            icon="shield-check"
            title="Alertas transparentes"
            description="Score de 0 a 100 com alertas visíveis e objetivos."
          />
          <FeatureItem
            icon="history"
            title="Histórico inteligente"
            description="Guarde e compare seus produtos favoritos facilmente."
          />
        </View>

        {/* Call to Action Fixo na Base */}
        <View style={styles.footer}>
          <ActionButton
            label="Começar agora"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
  },
  hero: {
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  heroLogo: {
    // Remova ou comente estas linhas se não quiser o círculo verde:
    // backgroundColor: Palette.primary,
    // borderRadius: radius.pill,
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    elevation: 4,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    textAlign: "center",
    color: Palette.text,
  },
  subtitle: {
    textAlign: "center",
    color: Palette.muted,
    paddingHorizontal: spacing.sm,
  },
  featuresContainer: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: Palette.surfaceAlt,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxl,
  },
});

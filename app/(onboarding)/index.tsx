import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';

export default function OnboardingScreen() {
  return (
    <ScreenShell title="Rótula" subtitle="Seu app para analisar produtos com rapidez e confiança.">
      <SectionCard title="Entenda em segundos" subtitle="Uma nota clara, alertas visíveis e alternativas melhores.">
        <View style={styles.list}>
          <ThemedText>• Score destacado de 0 a 100</ThemedText>
          <ThemedText>• Alertas e pontos positivos separados</ThemedText>
          <ThemedText>• Histórico e favoritos para comparar depois</ThemedText>
        </View>
      </SectionCard>

      <Link href="/(auth)/login" asChild>
        <ThemedText type="link">Começar agora</ThemedText>
      </Link>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
});

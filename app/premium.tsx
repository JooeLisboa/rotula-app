import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function PremiumScreen() {
  return (
    <ScreenShell title="Rótula Premium" subtitle="Alertas inteligentes, histórico avançado e relatórios.">
      <ThemedText>Plano mensal: R$ 19,90</ThemedText>
      <ThemedText>Plano anual: R$ 149,90</ThemedText>
      <ThemedText>Plano família: R$ 249,90/ano</ThemedText>
    </ScreenShell>
  );
}

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function HistoryScreen() {
  return (
    <ScreenShell title="Histórico" subtitle="Últimos scans para revisitar decisões de compra.">
      <ThemedText>Estado vazio: nenhum scan registrado.</ThemedText>
    </ScreenShell>
  );
}

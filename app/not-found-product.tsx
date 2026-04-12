import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function NotFoundProductScreen() {
  return (
    <ScreenShell title="Produto não encontrado" subtitle="Ajude a comunidade enviando fotos e ingredientes.">
      <ThemedText>1. Tire foto da frente e verso</ThemedText>
      <ThemedText>2. Capture tabela nutricional</ThemedText>
      <ThemedText>3. Envie para moderação</ThemedText>
    </ScreenShell>
  );
}

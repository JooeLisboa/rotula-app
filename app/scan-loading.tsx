import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function ScanLoadingScreen() {
  return (
    <ScreenShell title="Analisando produto" subtitle="Processando dados do código de barras.">
      <ThemedText>Esta tela foi mantida para fluxos assíncronos de scanner real.</ThemedText>
      <Link href="/product/7891000100103">
        <ThemedText>Continuar para resultado de exemplo</ThemedText>
      </Link>
    </ScreenShell>
  );
}

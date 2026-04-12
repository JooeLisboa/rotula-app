import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function ScanLoadingScreen() {
  return (
    <ScreenShell title="Analisando produto" subtitle="Identificando ingredientes e calculando nota.">
      <ThemedText>Carregando scan...</ThemedText>
      <Link href="/product/7891000100103">
        <ThemedText>Continuar para resultado</ThemedText>
      </Link>
    </ScreenShell>
  );
}

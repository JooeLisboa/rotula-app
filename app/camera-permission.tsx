import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function CameraPermissionScreen() {
  return (
    <ScreenShell title="Permissão de câmera" subtitle="Precisamos da câmera para leitura de código de barras.">
      <ThemedText>Permita o acesso para escanear mais rápido no mercado.</ThemedText>
      <Link href="/scanner">
        <ThemedText>Voltar ao scanner</ThemedText>
      </Link>
    </ScreenShell>
  );
}

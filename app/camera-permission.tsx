import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function CameraPermissionScreen() {
  return (
    <ScreenShell title="Permissão de câmera" subtitle="A leitura automática precisa de acesso à câmera.">
      <ThemedText>
        Se você negou a permissão, abra as configurações do sistema e habilite a câmera para continuar escaneando.
      </ThemedText>
      <Link href="/scanner">
        <ThemedText type="link">Voltar ao scanner</ThemedText>
      </Link>
    </ScreenShell>
  );
}

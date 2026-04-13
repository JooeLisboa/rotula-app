import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function CameraPermissionScreen() {
  return (
    <ScreenShell title="Permissão de câmera" subtitle="A câmera exige módulo nativo e permissões no app config.">
      <ThemedText>
        Nesta base, o scanner está em fallback manual para manter compatibilidade com Expo Go sem dependências nativas extras.
      </ThemedText>
      <ThemedText>
        Quando o módulo de câmera estiver instalado, esta tela pode solicitar permissões e redirecionar para leitura em tempo real.
      </ThemedText>
      <Link href="/scanner">
        <ThemedText>Voltar ao scanner</ThemedText>
      </Link>
    </ScreenShell>
  );
}

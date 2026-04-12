import { Link } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function ProfileScreen() {
  return (
    <ScreenShell title="Perfil" subtitle="Preferências, assinatura e privacidade.">
      <Link href="/premium">
        <ThemedText>Assinar plano Premium</ThemedText>
      </Link>
      <Link href="/settings">
        <ThemedText>Configurações</ThemedText>
      </Link>
    </ScreenShell>
  );
}

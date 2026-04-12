import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  return (
    <ScreenShell title="Configurações" subtitle="Privacidade, notificações e preferências de dieta.">
      <ThemedText>Notificações de alergênicos</ThemedText>
      <ThemedText>Idioma</ThemedText>
      <ThemedText>Termos e privacidade</ThemedText>
    </ScreenShell>
  );
}

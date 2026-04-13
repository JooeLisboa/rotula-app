import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { userService } from '@/src/services/user/user-service';
import type { UserProfile } from '@/src/types/user';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    userService
      .getProfile()
      .then(setProfile)
      .catch((error) => {
        captureError(error, { scope: 'screen.profile.load' });
      });
  }, []);

  async function handleLogout() {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      captureError(error, { scope: 'screen.profile.logout' });
    }
  }

  return (
    <ScreenShell title="Perfil" subtitle="Suas preferências, assinatura e privacidade em um só lugar.">
      <SectionCard title={profile?.name ?? session?.user.name ?? 'Usuário'} subtitle={profile?.email ?? session?.user.email}>
        <View style={styles.links}>
          <Link href="/premium" asChild>
            <ThemedText type="link">Conhecer plano Premium</ThemedText>
          </Link>
          <Link href="/settings" asChild>
            <ThemedText type="link">Configurações da conta</ThemedText>
          </Link>
        </View>
      </SectionCard>

      <ActionButton label="Sair da conta" onPress={handleLogout} variant="ghost" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  links: { gap: spacing.xs },
});

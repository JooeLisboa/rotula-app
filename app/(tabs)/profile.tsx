import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { userService } from '@/src/services/user/user-service';
import type { UserProfile } from '@/src/types/user';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

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
    <ScreenShell title="Perfil" subtitle="Preferências, assinatura e privacidade.">
      <ThemedText>{profile?.name ?? session?.user.name}</ThemedText>
      <ThemedText>{profile?.email ?? session?.user.email}</ThemedText>

      <Link href="/premium">
        <ThemedText>Assinar plano Premium</ThemedText>
      </Link>
      <Link href="/settings">
        <ThemedText>Configurações</ThemedText>
      </Link>

      <Pressable onPress={handleLogout} style={styles.button}>
        <ThemedText style={styles.buttonText}>Sair da conta</ThemedText>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: Palette.secondary,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

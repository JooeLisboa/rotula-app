import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';
import { useAuth } from '@/src/hooks/use-auth';

export default function RegisterScreen() {
  const router = useRouter(); const { t } = useLanguage(); const { register, isAuthenticating } = useAuth();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState<string | null>(null);
  async function handleRegister() { setError(null); trackEvent(EventName.RegisterStarted); try { await register({ name: name.trim(), email: email.trim(), password }); router.replace('/(tabs)'); } catch (e) { setError(e instanceof Error ? e.message : 'Erro'); } }
  return <ScreenShell title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')}><View style={styles.form}><TextInput placeholder={t('auth.name')} style={styles.input} value={name} onChangeText={setName} /><TextInput placeholder={t('auth.email')} style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" /><TextInput placeholder={t('auth.password')} style={styles.input} value={password} onChangeText={setPassword} secureTextEntry /></View>{error ? <ErrorState title="Erro" description={error} /> : null}<ActionButton label={isAuthenticating ? t('auth.registering') : t('auth.register')} onPress={handleRegister} disabled={isAuthenticating} /></ScreenShell>;
}
const styles = StyleSheet.create({ form: { gap: spacing.sm }, input: { borderWidth: 1, borderColor: Palette.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: Palette.surface, minHeight: 48, color: Palette.text } });

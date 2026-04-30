import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';
import { authService } from '@/src/services/auth/auth-service';

export default function ForgotPasswordScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    if (!email.trim()) { setError(t('auth.emptyEmail')); return; }
    setLoading(true); setError(null); setSuccess(null);
    try { await authService.forgotPassword({ email: email.trim() }); trackEvent(EventName.PasswordResetRequested); setSuccess(t('auth.resetSent')); } catch (e) { setError(e instanceof Error ? e.message : 'Erro'); } finally { setLoading(false); }
  }

  return <ScreenShell title={t('auth.forgotTitle')} subtitle={t('auth.forgotSubtitle')}><View style={styles.form}><TextInput placeholder={t('auth.email')} style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></View>{error ? <ErrorState title="Erro" description={error} /> : null}{success ? <ThemedText>{success}</ThemedText> : null}<ActionButton label={loading ? t('auth.sendingReset') : t('auth.sendReset')} onPress={handleReset} disabled={loading} /></ScreenShell>;
}
const styles = StyleSheet.create({ form: { gap: spacing.sm }, input: { borderWidth: 1, borderColor: Palette.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: Palette.surface, minHeight: 48, color: Palette.text } });

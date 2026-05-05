import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { ErrorState } from '@/components/ui/error-state';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { LanguageSwitcher } from '@/src/components/language-switcher';
import { useAuth } from '@/src/hooks/use-auth';
import { useLanguage } from '@/src/hooks/use-language';
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function LoginScreen(){const router=useRouter();const {t}=useLanguage();const {login,isAuthenticating}=useAuth();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState<string|null>(null);
const handleLogin=async()=>{const normalized=email.trim().toLowerCase();if(!normalized)return setError(t('auth.emptyEmail'));if(!EMAIL_RE.test(normalized))return setError(t('auth.invalidEmail'));if(!password)return setError(t('auth.emptyPassword'));setError(null);trackEvent(EventName.LoginStarted);try{await login({email:normalized,password});trackEvent(EventName.LoginSuccess);router.replace('/(tabs)');}catch{trackEvent(EventName.LoginFailure,{reason:'unknown_error'});setError(t('common.error'));}};
return <ScreenShell title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}><LanguageSwitcher/><View style={styles.form}><TextInput placeholder={t('auth.email')} placeholderTextColor={Palette.muted} style={styles.input} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/><TextInput placeholder={t('auth.password')} placeholderTextColor={Palette.muted} style={styles.input} secureTextEntry value={password} onChangeText={setPassword}/>{error?<ErrorState title={t('common.error')} description={error}/>:null}</View><ActionButton label={isAuthenticating?t('auth.loggingIn'):t('auth.login')} onPress={handleLogin} disabled={isAuthenticating}/><Link href="/(auth)/forgot-password" asChild><TouchableOpacity><ThemedText type="link">{t('auth.forgotPassword')}</ThemedText></TouchableOpacity></Link><Link href="/(auth)/register" asChild><TouchableOpacity><ThemedText type="link">{t('auth.createAccount')}</ThemedText></TouchableOpacity></Link></ScreenShell>}
const styles=StyleSheet.create({form:{gap:spacing.sm},input:{borderWidth:1,borderColor:Palette.border,borderRadius:radius.md,padding:spacing.md,backgroundColor:Palette.surface,minHeight:48,color:Palette.text}});

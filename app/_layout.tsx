import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { AuthGate } from '@/src/components/auth-gate';
import { useAuth } from '@/src/hooks/use-auth';
import { initMonitoring } from '@/src/lib/observability/monitoring';
import { AppProvider } from '@/src/providers/app-provider';

function RootNavigator() {
  const { isInitializing } = useAuth();
  if (isInitializing) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  return <><AuthGate /><Stack screenOptions={{ headerShown: false }} /></>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => { initMonitoring(); trackEvent(EventName.AppOpened); }, []);
  return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}><AppProvider><RootNavigator /></AppProvider><StatusBar style="auto" /></ThemeProvider>;
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scanner" />
        <Stack.Screen name="scan-loading" />
        <Stack.Screen name="camera-permission" />
        <Stack.Screen name="product/[barcode]" />
        <Stack.Screen name="compare" />
        <Stack.Screen name="premium" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="not-found-product" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

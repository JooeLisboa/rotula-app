import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { radius, spacing } from '@/constants/theme';

export function ScanCTA() {
  return (
    <Link href="/scanner" asChild>
      <Pressable style={styles.wrap} accessibilityHint="Abre o scanner manual para análise de código de barras.">
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold" style={styles.title}>Escanear agora</ThemedText>
          <ThemedText style={styles.arrow}>→</ThemedText>
        </View>
        <ThemedText style={styles.desc}>Aponte para o código de barras ou digite manualmente.</ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#156B3F',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff' },
  arrow: { color: '#fff', fontSize: 20, fontWeight: '700' },
  desc: { color: '#E8F8EE' },
});

import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { spacing } from '@/constants/theme';
import { captureError } from '@/src/lib/observability/monitoring';
import { userService } from '@/src/services/user/user-service';
import type { HistoryEntry } from '@/src/types/user';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    userService
      .getHistory()
      .then((entries) => {
        setHistory(entries);
      })
      .catch((error) => {
        captureError(error, { scope: 'screen.history.list' });
      });
  }, []);

  return (
    <ScreenShell title="Histórico" subtitle="Sua linha do tempo de escaneamentos recentes.">
      {history.length === 0 ? (
        <EmptyState
          title="Sem escaneamentos"
          description="Seus últimos produtos analisados aparecem aqui automaticamente."
        />
      ) : (
        <SectionCard title="Últimos produtos" subtitle="Toque para abrir novamente a análise.">
          {history.map((entry) => (
            <View key={entry.id} style={styles.row}>
              <View style={styles.textWrap}>
                <ThemedText type="defaultSemiBold">{entry.productName}</ThemedText>
                <ThemedText type="caption">{new Date(entry.scannedAt).toLocaleDateString('pt-BR')}</ThemedText>
              </View>
              <Link href={`/product/${entry.barcode}`} asChild>
                <ThemedText type="link">Ver</ThemedText>
              </Link>
            </View>
          ))}
        </SectionCard>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'center',
  },
  textWrap: { flex: 1 },
});

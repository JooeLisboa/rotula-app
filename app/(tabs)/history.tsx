import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
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
    <ScreenShell title="Histórico" subtitle="Produtos escaneados recentemente.">
      {history.map((entry) => (
        <Link key={entry.id} href={`/product/${entry.barcode}`}>
          <ThemedText>
            • {entry.productName} ({new Date(entry.scannedAt).toLocaleDateString('pt-BR')})
          </ThemedText>
        </Link>
      ))}
    </ScreenShell>
  );
}

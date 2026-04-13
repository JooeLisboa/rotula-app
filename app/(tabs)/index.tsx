import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ScoreBadge } from '@/components/ui/score-badge';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { captureError } from '@/src/lib/observability/monitoring';
import { productsService } from '@/src/services/products/products-service';
import type { Product } from '@/src/types/product';

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;

    productsService
      .getFeatured()
      .then((result) => {
        if (mounted) {
          setFeatured(result);
        }
      })
      .catch((error) => {
        captureError(error, { scope: 'screen.home.featured' });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenShell title="Olá 👋" subtitle="Escaneie produtos e receba uma análise instantânea.">
      <Link href="/scanner" asChild>
        <Pressable style={styles.cta}>
          <ThemedText style={styles.ctaText}>Escanear código de barras</ThemedText>
        </Pressable>
      </Link>

      <View style={styles.card}>
        <ThemedText type="subtitle">Produto em destaque</ThemedText>
        {featured ? (
          <>
            <ThemedText>{featured.name}</ThemedText>
            <ScoreBadge score={featured.score} classification={featured.classification} />
            <Link href={`/product/${featured.barcode}`}>
              <ThemedText style={styles.link}>Ver análise completa</ThemedText>
            </Link>
          </>
        ) : (
          <ThemedText>Carregando destaque...</ThemedText>
        )}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cta: {
    backgroundColor: Palette.primary,
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  card: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  link: { color: Palette.secondary },
});

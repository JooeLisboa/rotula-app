import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { captureError } from '@/src/lib/observability/monitoring';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    userService
      .getFavorites()
      .then((result) => {
        setFavorites(result.items);
      })
      .catch((error) => {
        captureError(error, { scope: 'screen.favorites.list' });
      });
  }, []);

  return (
    <ScreenShell title="Favoritos" subtitle="Seus produtos salvos para comparar depois.">
      {favorites.length === 0 ? (
        <ThemedText>Estado vazio: você ainda não favoritou produtos.</ThemedText>
      ) : (
        favorites.map((product) => (
          <Link key={product.id} href={`/product/${product.barcode}`}>
            <ThemedText>• {product.name}</ThemedText>
          </Link>
        ))
      )}
    </ScreenShell>
  );
}

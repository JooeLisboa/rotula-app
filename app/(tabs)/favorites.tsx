import { useEffect, useState } from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/ui/product-card';
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
    <ScreenShell title="Favoritos" subtitle="Seus produtos salvos para comparar com calma.">
      {favorites.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Ao salvar um produto, ele fica aqui para revisão rápida."
        />
      ) : (
        favorites.map((product) => <ProductCard key={product.id} product={product} />)
      )}
    </ScreenShell>
  );
}

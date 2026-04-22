import { useEffect, useState } from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProductCard } from '@/components/ui/product-card';
import { useAuth } from '@/src/hooks/use-auth';
import { captureError } from '@/src/lib/observability/monitoring';
import { userService } from '@/src/services/user/user-service';
import type { Product } from '@/src/types/product';

export default function FavoritesScreen() {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const uid = session?.user.id;

    if (!uid) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    userService
      .listFavorites(uid)
      .then((result) => {
        if (mounted) {
          setFavorites(result.items);
        }
      })
      .catch((error) => {
        captureError(error, { scope: 'screen.favorites.list' });
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [session?.user.id]);

  return (
    <ScreenShell title="Favoritos" subtitle="Seus produtos salvos para comparar com calma.">
      {isLoading ? (
        <LoadingState label="Carregando favoritos..." />
      ) : favorites.length === 0 ? (
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

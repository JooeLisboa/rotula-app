import { isMockApi } from '@/src/config/env';
import { apiClient } from '@/src/lib/api/http-client';
import { persistentStore } from '@/src/lib/storage/persistent-store';
import { mockProducts } from '@/src/mocks/products';
import type { FavoritesState, HistoryEntry, UserProfile } from '@/src/types/user';

const FAVORITES_KEY = 'rotula.favorites.v1';

let favoritesCache: Set<string> | null = null;

async function ensureFavoritesCache() {
  if (favoritesCache) {
    return favoritesCache;
  }

  const persisted = await persistentStore.getItem<string[]>(FAVORITES_KEY);
  favoritesCache = new Set(persisted ?? []);
  return favoritesCache;
}

async function persistFavorites(ids: Set<string>) {
  await persistentStore.setItem(FAVORITES_KEY, Array.from(ids));
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    if (isMockApi) {
      return {
        id: 'user-1',
        name: 'Usuário Rótula',
        email: 'demo@rotula.app',
      };
    }

    return apiClient.request<UserProfile>('/me');
  },

  async getHistory(): Promise<HistoryEntry[]> {
    if (isMockApi) {
      return mockProducts.map((product) => ({
        id: `history-${product.id}`,
        barcode: product.barcode,
        productName: product.name,
        scannedAt: new Date().toISOString(),
      }));
    }

    return apiClient.request<HistoryEntry[]>('/me/history');
  },

  async getFavorites(): Promise<FavoritesState> {
    if (!isMockApi) {
      return apiClient.request<FavoritesState>('/me/favorites');
    }

    const ids = await ensureFavoritesCache();
    const items = mockProducts.filter((product) => ids.has(product.id));
    return { items };
  },

  async toggleFavorite(productId: string): Promise<boolean> {
    if (!isMockApi) {
      const response = await apiClient.request<{ isFavorite: boolean }>(`/me/favorites/${productId}`, {
        method: 'POST',
      });

      return response.isFavorite;
    }

    const ids = await ensureFavoritesCache();
    if (ids.has(productId)) {
      ids.delete(productId);
      await persistFavorites(ids);
      return false;
    }

    ids.add(productId);
    await persistFavorites(ids);
    return true;
  },
};

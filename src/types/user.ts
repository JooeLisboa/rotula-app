import type { Product } from '@/src/types/product';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface UserPreference {
  id: string;
  locale: string;
  notificationsEnabled: boolean;
}

export interface HistoryEntry {
  id: string;
  uid: string;
  barcode: string;
  productId: string;
  productName: string;
  scannedAt: string;
}

export interface FavoriteEntry {
  id: string;
  uid: string;
  productId: string;
  barcode: string;
  createdAt: string;
}

export interface FavoritesState {
  items: Product[];
}

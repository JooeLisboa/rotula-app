import type { Product } from '@/src/types/product';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface HistoryEntry {
  id: string;
  barcode: string;
  scannedAt: string;
  productName: string;
}

export interface FavoritesState {
  items: Product[];
}

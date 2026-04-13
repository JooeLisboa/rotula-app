import { userRepository } from '@/src/repositories/user-repository';
import type { FavoritesState, HistoryEntry, UserProfile } from '@/src/types/user';

export const userService = {
  getProfile(): Promise<UserProfile> {
    return userRepository.getProfile();
  },
  getHistory(): Promise<HistoryEntry[]> {
    return userRepository.getHistory();
  },
  addScanHistory(input: { barcode: string; productId: string; productName: string }) {
    return userRepository.addScanHistory(input);
  },
  getFavorites(): Promise<FavoritesState> {
    return userRepository.getFavorites();
  },
  toggleFavorite(productId: string, barcode: string): Promise<boolean> {
    return userRepository.toggleFavorite({ productId, barcode });
  },
};

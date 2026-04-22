import { userRepository } from '@/src/repositories/user-repository';
import type { FavoritesState, HistoryEntry, UserProfile } from '@/src/types/user';

export const userService = {
  getProfile(): Promise<UserProfile> {
    return userRepository.getProfile();
  },
  listHistory(uid: string): Promise<HistoryEntry[]> {
    return userRepository.listHistory(uid);
  },
  addScanToHistory(uid: string, barcode: string, productName: string) {
    return userRepository.addScanToHistory(uid, barcode, productName);
  },
  listFavorites(uid: string): Promise<FavoritesState> {
    return userRepository.listFavorites(uid);
  },
  toggleFavorite(uid: string, barcode: string): Promise<boolean> {
    return userRepository.toggleFavorite(uid, barcode);
  },
  isFavorite(uid: string, barcode: string): Promise<boolean> {
    return userRepository.isFavorite(uid, barcode);
  },
  getHistory(): Promise<HistoryEntry[]> {
    return userRepository.getHistory();
  },
  getFavorites(): Promise<FavoritesState> {
    return userRepository.getFavorites();
  },
};

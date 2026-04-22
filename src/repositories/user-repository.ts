import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseDb } from '@/src/lib/firebase/client';
import { productRepository } from '@/src/repositories/product-repository';
import type { FavoritesState, HistoryEntry, UserProfile } from '@/src/types/user';

function currentUid() {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('Usuário não autenticado.');
  }

  return uid;
}

export const userRepository = {
  async getProfile(): Promise<UserProfile> {
    const uid = currentUid();
    const profileSnapshot = await getDoc(doc(getFirebaseDb(), 'user_profiles', uid));

    if (!profileSnapshot.exists()) {
      const currentUser = getFirebaseAuth().currentUser;
      return {
        id: uid,
        name: currentUser?.displayName ?? 'Usuário',
        email: currentUser?.email ?? '',
      };
    }

    const data = profileSnapshot.data();

    return {
      id: uid,
      name: String(data.name ?? ''),
      email: String(data.email ?? ''),
      avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined,
    };
  },

  async addScanToHistory(uid: string, barcode: string, productName: string) {
    const historyRef = doc(collection(getFirebaseDb(), 'users', uid, 'history'));
    await setDoc(historyRef, {
      uid,
      barcode,
      productName,
      scannedAt: serverTimestamp(),
    });
  },

  async listHistory(uid: string): Promise<HistoryEntry[]> {
    const snapshot = await getDocs(
      query(collection(getFirebaseDb(), 'users', uid, 'history'), orderBy('scannedAt', 'desc'), limit(50))
    );

    return snapshot.docs.map((entry) => ({
      id: entry.id,
      uid,
      barcode: String(entry.data().barcode ?? ''),
      productId: String(entry.data().barcode ?? ''),
      productName: String(entry.data().productName ?? 'Produto'),
      scannedAt: entry.data().scannedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    }));
  },

  async toggleFavorite(uid: string, barcode: string) {
    const favoriteRef = doc(getFirebaseDb(), 'users', uid, 'favorites', barcode);
    const snapshot = await getDoc(favoriteRef);

    if (snapshot.exists()) {
      await deleteDoc(favoriteRef);
      return false;
    }

    await setDoc(favoriteRef, {
      uid,
      barcode,
      createdAt: serverTimestamp(),
    });

    return true;
  },

  async isFavorite(uid: string, barcode: string) {
    const favoriteRef = doc(getFirebaseDb(), 'users', uid, 'favorites', barcode);
    const snapshot = await getDoc(favoriteRef);
    return snapshot.exists();
  },

  async listFavorites(uid: string): Promise<FavoritesState> {
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'users', uid, 'favorites'), limit(100)));

    const products = await Promise.all(
      snapshot.docs.map(async (item) => {
        const barcode = String(item.data().barcode ?? '');
        if (!barcode) {
          return null;
        }

        return productRepository.findByBarcode(barcode);
      })
    );

    return {
      items: products.filter((item): item is NonNullable<typeof item> => Boolean(item)),
    };
  },

  async getHistory(): Promise<HistoryEntry[]> {
    return this.listHistory(currentUid());
  },

  async addScanHistory(input: { barcode: string; productId: string; productName: string }) {
    return this.addScanToHistory(currentUid(), input.barcode, input.productName);
  },

  async getFavorites(): Promise<FavoritesState> {
    return this.listFavorites(currentUid());
  },

  async toggleFavoriteForCurrentUser(barcode: string): Promise<boolean> {
    return this.toggleFavorite(currentUid(), barcode);
  },
};

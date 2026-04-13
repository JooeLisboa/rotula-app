import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseDb } from '@/src/lib/firebase/client';
import { productRepository } from '@/src/repositories/product-repository';
import type { FavoritesState, HistoryEntry, UserProfile } from '@/src/types/user';

function getUid() {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('Usuário não autenticado.');
  }
  return uid;
}

export const userRepository = {
  async getProfile(): Promise<UserProfile> {
    const uid = getUid();
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

  async getHistory(): Promise<HistoryEntry[]> {
    const uid = getUid();
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'scan_history'), where('uid', '==', uid)));

    return snapshot.docs
      .map((entry) => ({
        id: entry.id,
        uid,
        barcode: String(entry.data().barcode ?? ''),
        productId: String(entry.data().productId ?? ''),
        productName: String(entry.data().productName ?? ''),
        scannedAt: entry.data().scannedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }))
      .sort((a, b) => b.scannedAt.localeCompare(a.scannedAt));
  },

  async addScanHistory(input: { barcode: string; productId: string; productName: string }) {
    const uid = getUid();
    const entryRef = doc(collection(getFirebaseDb(), 'scan_history'));
    await setDoc(entryRef, {
      uid,
      barcode: input.barcode,
      productId: input.productId,
      productName: input.productName,
      scannedAt: serverTimestamp(),
    });
  },

  async getFavorites(): Promise<FavoritesState> {
    const uid = getUid();
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'favorites'), where('uid', '==', uid)));

    const products = await Promise.all(
      snapshot.docs.map(async (item) => {
        const barcode = String(item.data().barcode ?? '');
        return productRepository.findByBarcode(barcode);
      })
    );

    return {
      items: products.filter((item): item is NonNullable<typeof item> => Boolean(item)),
    };
  },

  async toggleFavorite(input: { productId: string; barcode: string }): Promise<boolean> {
    const uid = getUid();
    const favoriteId = `${uid}_${input.productId}`;
    const favoriteRef = doc(getFirebaseDb(), 'favorites', favoriteId);
    const snapshot = await getDoc(favoriteRef);

    if (snapshot.exists()) {
      await deleteDoc(favoriteRef);
      return false;
    }

    await setDoc(favoriteRef, {
      uid,
      productId: input.productId,
      barcode: input.barcode,
      createdAt: serverTimestamp(),
    });
    return true;
  },
};

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseDb } from '@/src/lib/firebase/client';
import { mockProducts } from '@/src/mocks/products';
import type { Product, ProductAlternative } from '@/src/types/product';

function mapProduct(productId: string, data: Record<string, unknown>, alternatives: ProductAlternative[]): Product {
  return {
    id: productId,
    barcode: String(data.barcode ?? ''),
    name: String(data.name ?? ''),
    brand: String(data.brand ?? 'Marca não informada'),
    category: (data.category as Product['category']) ?? 'alimento',
    score: Number(data.score ?? 0),
    classification: (data.classification as Product['classification']) ?? 'atencao',
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    criticalIngredients: (data.criticalIngredients as string[] | undefined) ?? [],
    positives: (data.positives as string[] | undefined) ?? [],
    warnings: (data.warnings as string[] | undefined) ?? [],
    alternatives,
  };
}

async function loadAlternatives(productId: string): Promise<ProductAlternative[]> {
  const alternativesSnapshot = await getDocs(
    query(collection(getFirebaseDb(), 'product_alternatives'), where('productId', '==', productId), limit(5))
  );

  return alternativesSnapshot.docs.map((item) => ({
    id: item.id,
    name: String(item.data().name ?? ''),
    score: Number(item.data().score ?? 0),
    barcode: typeof item.data().barcode === 'string' ? item.data().barcode : undefined,
  }));
}

export const productRepository = {
  async findByBarcode(barcode: string): Promise<Product | null> {
    const productRef = doc(getFirebaseDb(), 'products', barcode);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return null;
    }

    const alternatives = await loadAlternatives(productSnapshot.id);
    return mapProduct(productSnapshot.id, productSnapshot.data(), alternatives);
  },

  async getFeatured(): Promise<Product | null> {
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'products'), where('isFeatured', '==', true), limit(1)));
    const first = snapshot.docs[0];

    if (!first) {
      return null;
    }

    const alternatives = await loadAlternatives(first.id);
    return mapProduct(first.id, first.data(), alternatives);
  },

  async searchByName(queryText: string): Promise<Product[]> {
    const normalized = queryText.trim().toLowerCase();
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'products'), limit(25)));

    const products = await Promise.all(
      snapshot.docs
        .filter((item) => String(item.data().name ?? '').toLowerCase().includes(normalized))
        .map(async (item) => mapProduct(item.id, item.data(), await loadAlternatives(item.id)))
    );

    return products;
  },

  async seedProductsFromMockIfEmpty() {
    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'products'), limit(1)));
    if (!snapshot.empty || getFirebaseAuth().currentUser?.uid == null) {
      return;
    }

    await Promise.all(
      mockProducts.map((product) =>
        setDoc(doc(getFirebaseDb(), 'products', product.barcode), {
          ...product,
          isFeatured: product.id === mockProducts[0]?.id,
          updatedAt: serverTimestamp(),
        })
      )
    );
  },
};

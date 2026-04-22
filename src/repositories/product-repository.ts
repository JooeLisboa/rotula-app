import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

import {
  fetchOpenFoodFactsProductByBarcode,
  searchOpenFoodFactsByName,
  type OpenFoodFactsProduct,
} from '@/src/api/open-food-facts';
import { calculateProductScore, toProductInsight } from '@/src/domain/product-score';
import { getFirebaseDb, isFirebaseConfigured } from '@/src/lib/firebase/client';
import { captureError } from '@/src/lib/observability/monitoring';
import type { Product } from '@/src/types/product';

function mapCategory(tags: string[] | undefined): Product['category'] {
  const allTags = tags ?? [];

  if (allTags.some((tag) => tag.includes('beauty') || tag.includes('cosmetic'))) {
    return 'cosmetico';
  }

  if (allTags.some((tag) => tag.includes('hygiene') || tag.includes('toothpaste'))) {
    return 'higiene';
  }

  if (allTags.some((tag) => tag.includes('pharmacy') || tag.includes('supplement'))) {
    return 'farmacia';
  }

  return 'alimento';
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return undefined;
}

function getSodiumMg100g(product: OpenFoodFactsProduct): number | undefined {
  const sodiumDirect = toNumber(product.nutriments?.sodium_100g);
  if (typeof sodiumDirect === 'number') {
    return sodiumDirect * 1000;
  }

  const salt = toNumber(product.nutriments?.salt_100g);
  if (typeof salt === 'number') {
    return salt * 400;
  }

  return undefined;
}

function mapOpenFoodFactsToProduct(product: OpenFoodFactsProduct, barcode: string): Product {
  const scoreResult = calculateProductScore({
    name: product.product_name ?? 'Produto sem nome',
    ingredientsText: product.ingredients_text,
    novaGroup: toNumber(product.nova_group),
    nutriments: {
      sugars100g: toNumber(product.nutriments?.sugars_100g),
      sodium100g: getSodiumMg100g(product),
      saturatedFat100g: toNumber(product.nutriments?.['saturated-fat_100g']),
      fiber100g: toNumber(product.nutriments?.fiber_100g),
      protein100g: toNumber(product.nutriments?.proteins_100g),
    },
  });

  const criticalIngredients = (product.additives_tags ?? []).slice(0, 5).map((item) => item.replace('en:', '').replace(/-/g, ' '));

  return {
    id: barcode,
    barcode,
    name: product.product_name?.trim() || 'Produto sem nome',
    brand: product.brands?.split(',')[0]?.trim() || 'Marca não informada',
    category: mapCategory(product.categories_tags),
    imageUrl: product.image_front_small_url || product.image_front_url,
    criticalIngredients,
    alternatives: [],
    ...toProductInsight(scoreResult),
  };
}

function mapFirestoreToProduct(barcode: string, data: Record<string, unknown>): Product {
  return {
    id: barcode,
    barcode,
    name: String(data.name ?? 'Produto sem nome'),
    brand: String(data.brand ?? 'Marca não informada'),
    category: (data.category as Product['category']) ?? 'alimento',
    score: Number(data.score ?? 0),
    classification: (data.classification as Product['classification']) ?? 'atencao',
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    criticalIngredients: Array.isArray(data.criticalIngredients) ? (data.criticalIngredients as string[]) : [],
    positives: Array.isArray(data.positives) ? (data.positives as string[]) : [],
    warnings: Array.isArray(data.warnings) ? (data.warnings as string[]) : [],
    alternatives: [],
  };
}

async function readProductFromCache(barcode: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const snapshot = await getDoc(doc(getFirebaseDb(), 'products', barcode));
  if (!snapshot.exists()) {
    return null;
  }

  return mapFirestoreToProduct(barcode, snapshot.data());
}

async function saveProductToCache(product: Product, rawSourceVersion: string) {
  if (!isFirebaseConfigured()) {
    return;
  }

  await setDoc(
    doc(getFirebaseDb(), 'products', product.barcode),
    {
      barcode: product.barcode,
      source: 'open-food-facts',
      rawSourceVersion,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl ?? null,
      score: product.score,
      classification: product.classification,
      warnings: product.warnings,
      positives: product.positives,
      criticalIngredients: product.criticalIngredients,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export const productRepository = {
  async getOrCreateProductByBarcode(barcode: string): Promise<Product | null> {
    const normalized = barcode.trim();

    if (!/^\d{8,14}$/.test(normalized)) {
      throw new Error('Código de barras inválido.');
    }

    const fromCache = await readProductFromCache(normalized);
    if (fromCache) {
      return fromCache;
    }

    const offResponse = await fetchOpenFoodFactsProductByBarcode(normalized);
    if (!offResponse || offResponse.status !== 1 || !offResponse.product) {
      return null;
    }

    const mapped = mapOpenFoodFactsToProduct(offResponse.product, normalized);
    await saveProductToCache(mapped, 'off-api-v2');
    return mapped;
  },

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.getOrCreateProductByBarcode(barcode);
  },

  async getFeatured(): Promise<Product | null> {
    if (!isFirebaseConfigured()) {
      return null;
    }

    const snapshot = await getDocs(query(collection(getFirebaseDb(), 'products'), orderBy('updatedAt', 'desc'), limit(1)));
    const first = snapshot.docs[0];

    return first ? mapFirestoreToProduct(first.id, first.data()) : null;
  },

  async searchByName(queryText: string): Promise<Product[]> {
    try {
      const response = await searchOpenFoodFactsByName(queryText);
      const mapped = response.products
        .filter((item) => typeof item.code === 'string' && item.code.length > 0)
        .slice(0, 10)
        .map((item) => mapOpenFoodFactsToProduct(item, String(item.code)));

      return mapped;
    } catch (error) {
      captureError(error, { scope: 'repository.product.searchByName', query: queryText });
      return [];
    }
  },
};

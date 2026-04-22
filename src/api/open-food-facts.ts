import { env } from '@/src/config/env';

const OFF_BASE = env.openFoodFactsBaseUrl ?? 'https://br.openfoodfacts.org';

interface OpenFoodFactsProduct {
  code?: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  ingredients_text?: string;
  categories_tags?: string[];
  additives_tags?: string[];
  nova_group?: number;
  nutriments?: {
    sugars_100g?: number;
    sodium_100g?: number;
    salt_100g?: number;
    'saturated-fat_100g'?: number;
    fiber_100g?: number;
    proteins_100g?: number;
  };
}

export interface OpenFoodFactsBarcodeResponse {
  status: number;
  code?: string;
  product?: OpenFoodFactsProduct;
}

export interface OpenFoodFactsSearchResponse {
  products: OpenFoodFactsProduct[];
}

async function fetchWithTimeout(url: string, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Open Food Facts respondeu com status ${response.status}.`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchOpenFoodFactsProductByBarcode(barcode: string): Promise<OpenFoodFactsBarcodeResponse | null> {
  const normalizedBarcode = barcode.trim();

  if (!/^\d{8,14}$/.test(normalizedBarcode)) {
    throw new Error('Código de barras inválido. Use apenas números (8 a 14 dígitos).');
  }

  const response = await fetchWithTimeout(`${OFF_BASE}/api/v2/product/${normalizedBarcode}.json`);
  return (await response.json()) as OpenFoodFactsBarcodeResponse;
}

export async function searchOpenFoodFactsByName(query: string): Promise<OpenFoodFactsSearchResponse> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return { products: [] };
  }

  const fields = [
    'code',
    'product_name',
    'brands',
    'image_front_small_url',
    'image_front_url',
    'ingredients_text',
    'categories_tags',
    'additives_tags',
    'nova_group',
    'nutriments',
  ].join(',');

  const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(normalizedQuery)}&search_simple=1&action=process&json=1&page_size=20&fields=${fields}`;
  const response = await fetchWithTimeout(url);
  return (await response.json()) as OpenFoodFactsSearchResponse;
}

export type { OpenFoodFactsProduct };

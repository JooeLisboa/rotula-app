import { isMockApi } from '@/src/config/env';
import { apiClient } from '@/src/lib/api/http-client';
import { mockProducts } from '@/src/mocks/products';
import type { Product } from '@/src/types/product';

export const productsService = {
  async findByBarcode(barcode: string): Promise<Product | null> {
    if (isMockApi) {
      return mockProducts.find((product) => product.barcode === barcode) ?? null;
    }

    return apiClient.request<Product | null>(`/products/${barcode}`);
  },

  async getFeatured(): Promise<Product | null> {
    if (isMockApi) {
      return mockProducts[0] ?? null;
    }

    return apiClient.request<Product>('/products/featured');
  },

  async searchByName(query: string): Promise<Product[]> {
    if (isMockApi) {
      const normalized = query.trim().toLowerCase();
      return mockProducts.filter((product) => product.name.toLowerCase().includes(normalized));
    }

    return apiClient.request<Product[]>(`/products?query=${encodeURIComponent(query)}`);
  },
};

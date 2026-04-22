import { productRepository } from '@/src/repositories/product-repository';
import type { Product } from '@/src/types/product';

export const productsService = {
  findByBarcode(barcode: string): Promise<Product | null> {
    return productRepository.findByBarcode(barcode);
  },
  getFeatured(): Promise<Product | null> {
    return productRepository.getFeatured();
  },
  searchByName(query: string): Promise<Product[]> {
    return productRepository.searchByName(query);
  },
  getOrCreateProductByBarcode(barcode: string): Promise<Product | null> {
    return productRepository.getOrCreateProductByBarcode(barcode);
  },
};

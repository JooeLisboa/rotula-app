import { productsService } from '@/src/services/products/products-service';

export const productService = {
  findByBarcode: productsService.findByBarcode,
  searchByName: productsService.searchByName,
};

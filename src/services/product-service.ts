import { mockProducts } from '@/src/mocks/products';

export const productService = {
  findByBarcode: async (barcode: string) =>
    mockProducts.find((product) => product.barcode === barcode) ?? null,
  searchByName: async (query: string) =>
    mockProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase().trim())
    ),
};

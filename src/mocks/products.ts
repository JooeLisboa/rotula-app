import type { Product } from '@/src/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    barcode: '7891000100103',
    name: 'Cereal Matinal Choco Bits',
    brand: 'MarcaX',
    category: 'alimento',
    score: 42,
    classification: 'atencao',
    criticalIngredients: ['Açúcar', 'Corante caramelo IV', 'Xarope de glicose'],
    positives: ['Contém fibras', 'Sem gordura trans'],
    warnings: ['Alto teor de açúcar', 'Ultraprocessado'],
    alternatives: [
      { id: '2', name: 'Granola Integral Mix', score: 78 },
      { id: '3', name: 'Aveia Flocos Finos', score: 88 },
    ],
  },
  {
    id: '4',
    barcode: '7892000200201',
    name: 'Sabonete Líquido Suave',
    brand: 'Derma+,',
    category: 'higiene',
    score: 74,
    classification: 'bom',
    criticalIngredients: ['Fragrância'],
    positives: ['Sem parabenos', 'pH balanceado'],
    warnings: ['Contém fragrância sintética'],
    alternatives: [{ id: '5', name: 'Sabonete Sem Fragrância', score: 85 }],
  },
];

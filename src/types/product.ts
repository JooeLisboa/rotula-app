export type ScoreClassification = 'excelente' | 'bom' | 'atencao' | 'ruim' | 'evite';

export interface ProductAlternative {
  id: string;
  name: string;
  score: number;
  barcode?: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: 'alimento' | 'cosmetico' | 'higiene' | 'farmacia';
  score: number;
  classification: ScoreClassification;
  imageUrl?: string;
  criticalIngredients: string[];
  positives: string[];
  warnings: string[];
  alternatives: ProductAlternative[];
}

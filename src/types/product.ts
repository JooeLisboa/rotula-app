export type ScoreClassification = 'excelente' | 'bom' | 'atencao' | 'ruim' | 'evite';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: 'alimento' | 'cosmetico' | 'higiene' | 'farmacia';
  score: number;
  classification: ScoreClassification;
  criticalIngredients: string[];
  positives: string[];
  warnings: string[];
  alternatives: { id: string; name: string; score: number }[];
}

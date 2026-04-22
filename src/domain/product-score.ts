import type { Product, ScoreClassification } from '@/src/types/product';

export interface ScoreResult {
  score: number;
  classification: ScoreClassification;
  warnings: string[];
  positives: string[];
}

interface ProductScoreInput {
  name: string;
  ingredientsText?: string;
  nutriments?: {
    sugars100g?: number;
    sodium100g?: number;
    saturatedFat100g?: number;
    fiber100g?: number;
    protein100g?: number;
  };
  novaGroup?: number;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function toClassification(score: number): ScoreClassification {
  if (score >= 85) return 'excelente';
  if (score >= 70) return 'bom';
  if (score >= 50) return 'atencao';
  if (score >= 30) return 'ruim';
  return 'evite';
}

export function calculateProductScore(input: ProductScoreInput): ScoreResult {
  let score = 60;
  const warnings: string[] = [];
  const positives: string[] = [];

  const sugars = input.nutriments?.sugars100g;
  if (typeof sugars === 'number') {
    if (sugars >= 22.5) {
      score -= 22;
      warnings.push('Teor de açúcar muito alto por 100g.');
    } else if (sugars >= 10) {
      score -= 12;
      warnings.push('Teor de açúcar elevado por 100g.');
    } else if (sugars <= 5) {
      score += 5;
      positives.push('Baixo teor de açúcar.');
    }
  }

  const sodium = input.nutriments?.sodium100g;
  if (typeof sodium === 'number') {
    if (sodium >= 600) {
      score -= 18;
      warnings.push('Teor de sódio muito alto.');
    } else if (sodium >= 240) {
      score -= 10;
      warnings.push('Teor de sódio elevado.');
    } else if (sodium <= 120) {
      score += 5;
      positives.push('Baixo teor de sódio.');
    }
  }

  const saturatedFat = input.nutriments?.saturatedFat100g;
  if (typeof saturatedFat === 'number') {
    if (saturatedFat >= 5) {
      score -= 14;
      warnings.push('Gordura saturada alta para o consumo diário.');
    } else if (saturatedFat <= 1.5) {
      score += 4;
      positives.push('Baixo teor de gordura saturada.');
    }
  }

  if (input.novaGroup === 4) {
    score -= 18;
    warnings.push('Produto ultraprocessado (NOVA 4).');
  } else if (input.novaGroup === 1) {
    score += 6;
    positives.push('Alimento minimamente processado (NOVA 1).');
  }

  const ingredients = (input.ingredientsText ?? '').toLowerCase();
  const criticalTerms = ['xarope de glicose', 'xarope de frutose', 'gordura hidrogenada', 'nitrito', 'corante'];
  const criticalFound = criticalTerms.filter((term) => ingredients.includes(term));
  if (criticalFound.length > 0) {
    score -= Math.min(criticalFound.length * 6, 18);
    warnings.push('Lista de ingredientes com aditivos de maior atenção.');
  }

  const fiber = input.nutriments?.fiber100g;
  if (typeof fiber === 'number' && fiber >= 6) {
    score += 8;
    positives.push('Boa quantidade de fibras.');
  }

  const protein = input.nutriments?.protein100g;
  if (typeof protein === 'number' && protein >= 8) {
    score += 5;
    positives.push('Boa quantidade de proteína.');
  }

  const finalScore = clamp(Math.round(score));

  return {
    score: finalScore,
    classification: toClassification(finalScore),
    warnings,
    positives,
  };
}

export function toProductInsight(result: ScoreResult): Pick<Product, 'score' | 'classification' | 'warnings' | 'positives'> {
  return {
    score: result.score,
    classification: result.classification,
    warnings: result.warnings,
    positives: result.positives,
  };
}

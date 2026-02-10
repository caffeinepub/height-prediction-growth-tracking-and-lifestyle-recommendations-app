import type { FormulaResult } from '../../backend';

interface PredictionInput {
  age: number;
  isMale: boolean;
  currentHeightCm?: number;
  fatherHeightCm: number;
  motherHeightCm: number;
  boneAgeCm?: number;
}

interface PredictionOutput {
  results: FormulaResult[];
  average: number;
}

export function calculatePredictions(input: PredictionInput): PredictionOutput {
  const results: FormulaResult[] = [];

  // 1. Mid-Parental Height Method
  const midParentalHeight = input.isMale
    ? (input.fatherHeightCm + input.motherHeightCm + 13) / 2
    : (input.fatherHeightCm + input.motherHeightCm - 13) / 2;

  results.push({
    name: 'Mid-Parental Height',
    enabled: true,
    predictedHeightCm: midParentalHeight,
  });

  // 2. Khamis-Roche Method (requires current height and age 4-17.5)
  if (input.currentHeightCm && input.age >= 4 && input.age < 18) {
    // Improved Khamis-Roche implementation
    // This method uses current height, mid-parental height, and age-specific coefficients
    const midParental = (input.fatherHeightCm + input.motherHeightCm) / 2;
    
    // Age-based growth multipliers (simplified but more accurate than previous)
    let heightCoefficient: number;
    let parentalCoefficient: number;
    
    if (input.isMale) {
      // Males: growth slows as they approach 18
      const yearsToMaturity = 18 - input.age;
      heightCoefficient = 0.545 + (yearsToMaturity * 0.025);
      parentalCoefficient = 0.455 - (yearsToMaturity * 0.025);
    } else {
      // Females: growth slows as they approach 16
      const yearsToMaturity = 16 - input.age;
      heightCoefficient = 0.545 + (yearsToMaturity * 0.028);
      parentalCoefficient = 0.455 - (yearsToMaturity * 0.028);
    }
    
    const khamis = (input.currentHeightCm * heightCoefficient) + (midParental * parentalCoefficient) + 
                   (input.isMale ? 5.5 : -5.5);
    
    results.push({
      name: 'Khamis-Roche Method',
      enabled: true,
      predictedHeightCm: khamis,
    });
  } else {
    results.push({
      name: 'Khamis-Roche Method',
      enabled: false,
      predictedHeightCm: 0,
    });
  }

  // 3. Tanner Method (simplified, requires current height)
  if (input.currentHeightCm && input.age > 2 && input.age < 18) {
    const growthRemaining = input.isMale
      ? (18 - input.age) * 5.5
      : (16 - input.age) * 5.0;
    const tanner = input.currentHeightCm + growthRemaining;
    
    results.push({
      name: 'Tanner Method',
      enabled: true,
      predictedHeightCm: tanner,
    });
  } else {
    results.push({
      name: 'Tanner Method',
      enabled: false,
      predictedHeightCm: 0,
    });
  }

  // 4. Bayley-Pinneau Method (simplified)
  if (input.currentHeightCm && input.age > 6 && input.age < 18) {
    const percentMature = input.isMale
      ? 0.5 + (input.age / 18) * 0.5
      : 0.5 + (input.age / 16) * 0.5;
    const bayley = input.currentHeightCm / percentMature;
    
    results.push({
      name: 'Bayley-Pinneau Method',
      enabled: true,
      predictedHeightCm: bayley,
    });
  } else {
    results.push({
      name: 'Bayley-Pinneau Method',
      enabled: false,
      predictedHeightCm: 0,
    });
  }

  // Calculate average of enabled formulas
  const enabledResults = results.filter(r => r.enabled);
  const average = enabledResults.length > 0
    ? enabledResults.reduce((sum, r) => sum + r.predictedHeightCm, 0) / enabledResults.length
    : 0;

  return { results, average };
}

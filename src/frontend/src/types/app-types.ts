/**
 * Application-specific type definitions
 * 
 * These types define the data structures used throughout the application.
 * They should match the backend interface types once the backend is restored.
 */

export interface UserProfile {
  gender: string; // Used to store user's name (legacy field mapping)
  age: number;
  fatherHeightCm: number;
  motherHeightCm: number;
  isMale: boolean;
  currentHeightCm?: number;
}

export interface HeightMeasurement {
  id: bigint;
  heightCm: number;
  timestamp: bigint;
}

export interface FormulaResult {
  name: string;
  predictedHeightCm: number;
  enabled: boolean;
}

export interface HeightPrediction {
  formulaResults: FormulaResult[];
  predictionCounts: bigint;
  activeFormulaCount: bigint;
  averageHeightCm: number;
  timestamp: bigint;
}

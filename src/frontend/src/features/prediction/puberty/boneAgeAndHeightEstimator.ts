import type { PubertyStageResult } from './pubertyQuestionnaire';

interface BoneAgeInput {
  chronologicalAge: number;
  isMale: boolean;
  pubertyStage: PubertyStageResult;
}

interface BoneAgeEstimate {
  estimatedBoneAge: number;
  explanation: string;
}

interface HeightPredictionInput {
  currentHeightCm: number;
  estimatedBoneAge: number;
  chronologicalAge: number;
  isMale: boolean;
  fatherHeightCm: number;
  motherHeightCm: number;
}

interface HeightPredictionResult {
  predictedHeightCm: number;
  explanation: string;
}

export function estimateBoneAge(input: BoneAgeInput): BoneAgeEstimate {
  const { chronologicalAge, isMale, pubertyStage } = input;
  const stageNumber = pubertyStage.stageNumber;

  // Bone age estimation based on puberty stage
  let boneAgeOffset = 0;

  if (stageNumber === 1) {
    // Pre-puberty: bone age typically matches or is slightly behind chronological age
    boneAgeOffset = -0.5;
  } else if (stageNumber === 2) {
    // Early puberty: bone age typically matches chronological age
    boneAgeOffset = 0;
  } else if (stageNumber === 3) {
    // Mid-puberty: bone age may be slightly advanced
    boneAgeOffset = isMale ? 0.5 : 1.0;
  } else if (stageNumber === 4) {
    // Mid-to-late puberty: bone age is advanced
    boneAgeOffset = isMale ? 1.5 : 2.0;
  } else {
    // Late/post-puberty: bone age is significantly advanced
    boneAgeOffset = isMale ? 2.5 : 3.0;
  }

  const estimatedBoneAge = Math.max(chronologicalAge + boneAgeOffset, chronologicalAge);

  const explanation = `Based on your puberty stage (${pubertyStage.stage}), your estimated bone age is approximately ${estimatedBoneAge.toFixed(1)} years. ${
    boneAgeOffset > 0
      ? 'Your bone age appears slightly advanced relative to your chronological age, which is typical for your stage of development.'
      : boneAgeOffset < 0
      ? 'Your bone age appears slightly behind your chronological age, suggesting more growth potential.'
      : 'Your bone age appears to match your chronological age.'
  }`;

  return {
    estimatedBoneAge,
    explanation,
  };
}

export function predictHeightFromBoneAge(input: HeightPredictionInput): HeightPredictionResult {
  const { currentHeightCm, estimatedBoneAge, chronologicalAge, isMale, fatherHeightCm, motherHeightCm } = input;

  // Calculate mid-parental height
  const midParentalHeight = isMale
    ? (fatherHeightCm + motherHeightCm + 13) / 2
    : (fatherHeightCm + motherHeightCm - 13) / 2;

  // Estimate remaining growth based on bone age
  const maturityAge = isMale ? 18 : 16;
  const yearsToMaturity = Math.max(maturityAge - estimatedBoneAge, 0);

  // Growth rate decreases as bone age advances
  let growthRate: number;
  if (estimatedBoneAge < 12) {
    growthRate = isMale ? 6.0 : 5.5;
  } else if (estimatedBoneAge < 14) {
    growthRate = isMale ? 5.0 : 4.0;
  } else if (estimatedBoneAge < 16) {
    growthRate = isMale ? 3.5 : 2.5;
  } else if (estimatedBoneAge < 17) {
    growthRate = isMale ? 2.0 : 1.0;
  } else {
    growthRate = isMale ? 0.5 : 0.2;
  }

  const estimatedRemainingGrowth = yearsToMaturity * growthRate;

  // Combine current height with remaining growth, adjusted by parental height
  const rawPrediction = currentHeightCm + estimatedRemainingGrowth;
  
  // Weight the prediction with mid-parental height (70% bone age method, 30% genetics)
  const predictedHeightCm = rawPrediction * 0.7 + midParentalHeight * 0.3;

  const explanation = `Based on your estimated bone age of ${estimatedBoneAge.toFixed(1)} years and current height of ${currentHeightCm.toFixed(1)} cm, we estimate approximately ${estimatedRemainingGrowth.toFixed(1)} cm of remaining growth. This prediction combines your current growth trajectory with your genetic potential (mid-parental height: ${midParentalHeight.toFixed(1)} cm).`;

  return {
    predictedHeightCm,
    explanation,
  };
}

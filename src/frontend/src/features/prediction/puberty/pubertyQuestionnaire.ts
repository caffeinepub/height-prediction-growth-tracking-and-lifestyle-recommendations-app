export interface QuestionOption {
  value: string;
  label: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  category: 'physical' | 'timing';
}

export const pubertyQuestions: Question[] = [
  {
    id: 'puberty_start',
    text: 'At what age did you notice the first signs of puberty (growth spurt, body changes)?',
    category: 'timing',
    options: [
      { value: 'early', label: 'Before age 10', score: 5 },
      { value: 'normal_early', label: 'Age 10-12', score: 4 },
      { value: 'normal', label: 'Age 12-14', score: 3 },
      { value: 'late', label: 'Age 14-16', score: 2 },
      { value: 'very_late', label: 'After age 16 or not yet', score: 1 },
    ],
  },
  {
    id: 'armpit_hair',
    text: 'Do you have armpit hair?',
    category: 'physical',
    options: [
      { value: 'full', label: 'Yes, fully developed', score: 5 },
      { value: 'some', label: 'Yes, some growth', score: 3 },
      { value: 'minimal', label: 'Just starting', score: 2 },
      { value: 'none', label: 'No', score: 1 },
    ],
  },
  {
    id: 'facial_hair',
    text: 'Do you have facial hair (chin, upper lip, sideburns)?',
    category: 'physical',
    options: [
      { value: 'full', label: 'Yes, significant growth', score: 5 },
      { value: 'some', label: 'Yes, some growth', score: 3 },
      { value: 'minimal', label: 'Just starting (peach fuzz)', score: 2 },
      { value: 'none', label: 'No', score: 1 },
    ],
  },
  {
    id: 'pubic_hair',
    text: 'Development of pubic hair?',
    category: 'physical',
    options: [
      { value: 'adult', label: 'Adult-like pattern', score: 5 },
      { value: 'moderate', label: 'Moderate growth', score: 4 },
      { value: 'some', label: 'Some growth', score: 3 },
      { value: 'minimal', label: 'Just starting', score: 2 },
      { value: 'none', label: 'None', score: 1 },
    ],
  },
  {
    id: 'voice_change',
    text: 'Has your voice deepened?',
    category: 'physical',
    options: [
      { value: 'complete', label: 'Yes, completely', score: 5 },
      { value: 'mostly', label: 'Yes, mostly', score: 4 },
      { value: 'changing', label: 'Currently changing', score: 3 },
      { value: 'slight', label: 'Slight change', score: 2 },
      { value: 'none', label: 'No change', score: 1 },
    ],
  },
  {
    id: 'growth_spurt',
    text: 'Have you experienced a significant growth spurt?',
    category: 'physical',
    options: [
      { value: 'past', label: 'Yes, it has passed', score: 5 },
      { value: 'current', label: 'Yes, currently growing rapidly', score: 4 },
      { value: 'recent', label: 'Recently started', score: 3 },
      { value: 'minimal', label: 'Minimal growth', score: 2 },
      { value: 'none', label: 'Not yet', score: 1 },
    ],
  },
];

export interface PubertyStageResult {
  stage: string;
  stageNumber: number;
  description: string;
  explanation: string;
}

export function calculatePubertyStage(answers: Record<string, string>): PubertyStageResult {
  let totalScore = 0;
  let answeredCount = 0;

  pubertyQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        totalScore += option.score;
        answeredCount++;
      }
    }
  });

  const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0;

  let stage: string;
  let stageNumber: number;
  let description: string;
  let explanation: string;

  if (averageScore >= 4.5) {
    stage = 'Late Puberty / Post-Puberty';
    stageNumber = 5;
    description = 'You appear to be in late or post-pubertal stage (Tanner Stage 5)';
    explanation = 'Your responses indicate advanced physical development with most secondary sexual characteristics fully developed. Growth is likely slowing or complete.';
  } else if (averageScore >= 3.5) {
    stage = 'Mid-to-Late Puberty';
    stageNumber = 4;
    description = 'You appear to be in mid-to-late puberty (Tanner Stage 4)';
    explanation = 'Your responses show significant pubertal development with most characteristics well-established. You may still have some growth remaining.';
  } else if (averageScore >= 2.5) {
    stage = 'Mid-Puberty';
    stageNumber = 3;
    description = 'You appear to be in mid-puberty (Tanner Stage 3)';
    explanation = 'Your responses indicate active pubertal development with several characteristics emerging. You are likely in a period of rapid growth.';
  } else if (averageScore >= 1.5) {
    stage = 'Early Puberty';
    stageNumber = 2;
    description = 'You appear to be in early puberty (Tanner Stage 2)';
    explanation = 'Your responses suggest early pubertal changes are beginning. Most growth is still ahead of you.';
  } else {
    stage = 'Pre-Puberty / Very Early Puberty';
    stageNumber = 1;
    description = 'You appear to be in pre-puberty or very early puberty (Tanner Stage 1-2)';
    explanation = 'Your responses indicate minimal pubertal development. Most of your growth and development is still ahead.';
  }

  return {
    stage,
    stageNumber,
    description,
    explanation,
  };
}

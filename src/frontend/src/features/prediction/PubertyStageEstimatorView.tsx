import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Brain, AlertCircle } from 'lucide-react';
import { pubertyQuestions, calculatePubertyStage } from './puberty/pubertyQuestionnaire';
import { PubertyStageEstimatorResults } from './PubertyStageEstimatorResults';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

interface PubertyStageEstimatorViewProps {
  onBack: () => void;
}

export function PubertyStageEstimatorView({ onBack }: PubertyStageEstimatorViewProps) {
  const { data: profile } = useGetCallerUserProfile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = pubertyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / pubertyQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === pubertyQuestions.length - 1;
  const hasAnswer = !!answers[currentQuestion.id];

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const pubertyStage = calculatePubertyStage(answers);
    return (
      <PubertyStageEstimatorResults
        pubertyStage={pubertyStage}
        profile={profile}
        onBack={onBack}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Prediction Methods
      </Button>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-6 w-6" />
            Puberty-Stage Assessment
          </CardTitle>
          <CardDescription className="text-base">
            Answer questions about your development to estimate your puberty stage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-accent/10 border-accent/20">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-accent-foreground">
              <strong>Note:</strong> This is a rule-based questionnaire (not an external AI). Your answers help estimate your developmental stage for height prediction purposes only. This is not a medical assessment.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestionIndex + 1} of {pubertyQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-6 py-6">
            <h3 className="text-xl font-semibold">{currentQuestion.text}</h3>

            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.value })}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              size="lg"
              className="h-12"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
              size="lg"
              className="h-12 min-w-32"
            >
              {isLastQuestion ? 'View Results' : 'Next'}
              {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

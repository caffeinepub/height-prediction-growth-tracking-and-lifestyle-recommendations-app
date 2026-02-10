import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';
import type { PubertyStageResult } from './puberty/pubertyQuestionnaire';
import type { UserProfile } from '../../backend';
import { estimateBoneAge, predictHeightFromBoneAge } from './puberty/boneAgeAndHeightEstimator';
import { cmToFeetInches } from '../../utils/units';

interface PubertyStageEstimatorResultsProps {
  pubertyStage: PubertyStageResult;
  profile: UserProfile | null | undefined;
  onBack: () => void;
  onRestart: () => void;
}

export function PubertyStageEstimatorResults({
  pubertyStage,
  profile,
  onBack,
  onRestart,
}: PubertyStageEstimatorResultsProps) {
  const boneAgeEstimate = profile
    ? estimateBoneAge({
        chronologicalAge: profile.age,
        isMale: profile.isMale,
        pubertyStage,
      })
    : null;

  const heightPrediction =
    profile && profile.currentHeightCm && boneAgeEstimate
      ? predictHeightFromBoneAge({
          currentHeightCm: profile.currentHeightCm,
          estimatedBoneAge: boneAgeEstimate.estimatedBoneAge,
          chronologicalAge: profile.age,
          isMale: profile.isMale,
          fatherHeightCm: profile.fatherHeightCm,
          motherHeightCm: profile.motherHeightCm,
        })
      : null;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Prediction Methods
        </Button>
        <Button variant="outline" onClick={onRestart}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Restart Assessment
        </Button>
      </div>

      <Alert className="bg-destructive/10 border-destructive/30">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-base">
          <strong>Medical Disclaimer:</strong> This assessment is for informational and educational purposes only. It is not a medical diagnosis or professional medical advice. Consult a healthcare provider for accurate bone age assessment and growth evaluation.
        </AlertDescription>
      </Alert>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Your Puberty Stage Assessment</CardTitle>
          <CardDescription className="text-base">
            Based on your responses to the developmental questionnaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Estimated Stage</span>
              <Badge variant="default" className="text-base px-4 py-1">
                Stage {pubertyStage.stageNumber}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-accent mb-2">{pubertyStage.stage}</h3>
            <p className="text-base text-accent-foreground">{pubertyStage.description}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Explanation</h4>
            <p className="text-muted-foreground">{pubertyStage.explanation}</p>
          </div>

          {boneAgeEstimate && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-lg">Estimated Bone Age</h4>
                </div>
                <div className="p-5 bg-primary/10 rounded-lg border-2 border-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">Bone Age Estimate</div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {boneAgeEstimate.estimatedBoneAge.toFixed(1)} years
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chronological Age: {profile?.age.toFixed(1)} years
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{boneAgeEstimate.explanation}</p>
              </div>
            </>
          )}

          {heightPrediction && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Height Prediction</h4>
                <div className="p-6 bg-chart-1/10 rounded-lg border-2 border-chart-1/30">
                  <div className="text-sm text-muted-foreground mb-1 font-medium">
                    Predicted Adult Height
                  </div>
                  <div className="text-4xl font-bold text-chart-1 mb-2">
                    {heightPrediction.predictedHeightCm.toFixed(1)} cm
                  </div>
                  <div className="text-base text-muted-foreground">
                    {cmToFeetInches(heightPrediction.predictedHeightCm)}
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">How we calculated this:</h5>
                  <p className="text-sm text-muted-foreground">{heightPrediction.explanation}</p>
                </div>
              </div>
            </>
          )}

          {!profile?.currentHeightCm && (
            <Alert>
              <AlertDescription>
                To get a height prediction, please add your current height in your profile.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

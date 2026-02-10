import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetCallerUserProfile, useSavePrediction } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { calculatePredictions } from './predictionFormulas';
import { PredictionResultsTable } from './PredictionResultsTable';
import { PredictionLoadingScreen } from './components/PredictionLoadingScreen';
import { Activity, Info, ArrowLeft, AlertCircle } from 'lucide-react';
import type { HeightPrediction } from '../../types/app-types';

interface StandardPredictionViewProps {
  onBack: () => void;
}

export function StandardPredictionView({ onBack }: StandardPredictionViewProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: profile } = useGetCallerUserProfile();
  const saveMutation = useSavePrediction();
  const [results, setResults] = useState<HeightPrediction | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalculating) {
      timer = setTimeout(() => {
        if (!profile) return;

        const predictions = calculatePredictions({
          age: profile.age,
          isMale: profile.isMale,
          currentHeightCm: profile.currentHeightCm,
          fatherHeightCm: profile.fatherHeightCm,
          motherHeightCm: profile.motherHeightCm,
        });

        const predictionData: HeightPrediction = {
          formulaResults: predictions.results,
          predictionCounts: BigInt(predictions.results.length),
          activeFormulaCount: BigInt(predictions.results.filter(r => r.enabled).length),
          averageHeightCm: predictions.average,
          timestamp: BigInt(Date.now() * 1000000),
        };

        setResults(predictionData);
        setIsCalculating(false);

        if (isAuthenticated) {
          saveMutation.mutate(predictionData);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isCalculating, profile, isAuthenticated, saveMutation]);

  const handleCalculate = () => {
    setResults(null);
    setIsCalculating(true);
  };

  const canCalculate = profile && profile.fatherHeightCm > 0 && profile.motherHeightCm > 0;

  if (isCalculating) {
    return <PredictionLoadingScreen />;
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
            <Activity className="h-6 w-6" />
            Standard Height Prediction
          </CardTitle>
          <CardDescription className="text-base">
            Calculate your predicted adult height using multiple scientific formulas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!profile && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please complete your profile first to calculate height predictions.
              </AlertDescription>
            </Alert>
          )}

          {profile && !canCalculate && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please enter both parents' heights in your profile to calculate predictions.
              </AlertDescription>
            </Alert>
          )}

          <Alert className="bg-accent/10 border-accent/20">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-accent-foreground">
              <strong>Important:</strong> Height predictions are estimates based on scientific formulas. Different methods may produce varying results. These predictions are for informational purposes only and should not be considered medical advice.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleCalculate} 
            disabled={!canCalculate} 
            size="lg"
            className="w-full h-14 text-lg"
          >
            Calculate Predictions
          </Button>
        </CardContent>
      </Card>

      {results && <PredictionResultsTable prediction={results} />}
    </div>
  );
}

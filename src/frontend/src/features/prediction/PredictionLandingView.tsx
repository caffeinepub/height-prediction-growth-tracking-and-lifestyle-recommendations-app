import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users } from 'lucide-react';

interface PredictionLandingViewProps {
  onNavigateToStandard: () => void;
  onNavigateToPuberty: () => void;
}

export function PredictionLandingView({ onNavigateToStandard, onNavigateToPuberty }: PredictionLandingViewProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Prediction Method</h2>
        <p className="text-muted-foreground text-lg">
          Select the approach that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToStandard}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-24 h-24 border-2 border-primary rounded-md bg-card">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Standard Prediction</CardTitle>
            <CardDescription className="text-base">
              Uses genetic and current height data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Multiple proven formulas (Mid-Parental, Khamis-Roche, Tanner, Bayley-Pinneau)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Requires parent heights and current measurements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Best for ages 2-18</span>
              </li>
            </ul>
            <Button className="w-full" size="lg" onClick={onNavigateToStandard}>
              Get Standard Prediction
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToPuberty}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-24 h-24 border-2 border-primary rounded-md bg-card">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Puberty Stage Estimator</CardTitle>
            <CardDescription className="text-base">
              Guided questionnaire for detailed assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Step-by-step physical development questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Estimates bone age and puberty stage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>More detailed prediction for teens</span>
              </li>
            </ul>
            <Button className="w-full" size="lg" onClick={onNavigateToPuberty}>
              Start Questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

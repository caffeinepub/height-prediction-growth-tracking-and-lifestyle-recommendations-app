import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function PredictionLoadingScreen() {
  return (
    <Card className="border-2">
      <CardContent className="py-24">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">Calculating Your Height Predictions</h3>
            <p className="text-muted-foreground text-lg">
              Analyzing your data using multiple scientific formulas...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { HeightPrediction } from '../../types/app-types';
import { cmToFeetInches } from '../../utils/units';

interface PredictionResultsTableProps {
  prediction: HeightPrediction;
}

export function PredictionResultsTable({ prediction }: PredictionResultsTableProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Prediction Results</CardTitle>
        <CardDescription className="text-base">
          Individual formula predictions and combined average
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-6 bg-primary/10 rounded-lg border-2 border-primary/30">
          <div className="text-sm text-muted-foreground mb-2 font-medium">Average Predicted Height</div>
          <div className="text-4xl font-bold text-primary">
            {prediction.averageHeightCm.toFixed(1)} cm
          </div>
          <div className="text-base text-muted-foreground mt-2">
            {cmToFeetInches(prediction.averageHeightCm)}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Formula</TableHead>
              <TableHead className="text-base">Status</TableHead>
              <TableHead className="text-right text-base">Predicted Height</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prediction.formulaResults.map((result, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-base">{result.name}</TableCell>
                <TableCell>
                  {result.enabled ? (
                    <Badge variant="default" className="text-sm">Calculated</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm">Skipped</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {result.enabled ? (
                    <div>
                      <div className="font-medium text-base">{result.predictedHeightCm.toFixed(1)} cm</div>
                      <div className="text-sm text-muted-foreground">
                        {cmToFeetInches(result.predictedHeightCm)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

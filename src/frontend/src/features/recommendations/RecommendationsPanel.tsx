import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { getRecommendations } from './recommendationContent';
import { calculateAge } from '../../utils/age';
import { Apple, Dumbbell, AlertTriangle, Info } from 'lucide-react';

export function RecommendationsPanel() {
  const { data: profile } = useGetCallerUserProfile();

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Diet and exercise guidance for healthy growth</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please complete your profile to receive personalized recommendations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const age = profile.age;
  const isUnder18 = age < 18;
  const recommendations = getRecommendations(age, profile.isMale);

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before making any changes to your diet or exercise routine.
        </AlertDescription>
      </Alert>

      {isUnder18 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>For Young Users</AlertTitle>
          <AlertDescription>
            You are under 18. Please discuss any diet or exercise changes with your parents or guardians and consult a healthcare professional before starting any new regimen.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-chart-1" />
            Diet Recommendations
          </CardTitle>
          <CardDescription>Nutritional guidance for healthy growth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.diet.map((item, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.content}</p>
              {idx < recommendations.diet.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-chart-2" />
            Exercise Recommendations
          </CardTitle>
          <CardDescription>Physical activity guidance for optimal development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.exercise.map((item, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.content}</p>
              {idx < recommendations.exercise.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

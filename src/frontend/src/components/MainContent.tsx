import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileInputsPanel } from '../features/profile/ProfileInputsPanel';
import { PredictionPanel } from '../features/prediction/PredictionPanel';
import { GrowthLogPanel } from '../features/growth/GrowthLogPanel';
import { RecommendationsPanel } from '../features/recommendations/RecommendationsPanel';
import { User, TrendingUp, Activity, Lightbulb } from 'lucide-react';

export function MainContent() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <main className="container mx-auto px-4 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 h-auto">
          <TabsTrigger value="profile" className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center justify-center w-14 h-14 border-2 border-primary rounded-md bg-background">
              <User className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="prediction" className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center justify-center w-14 h-14 border-2 border-primary rounded-md bg-background">
              <TrendingUp className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium">Prediction</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center justify-center w-14 h-14 border-2 border-primary rounded-md bg-background">
              <Activity className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium">Growth</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center justify-center w-14 h-14 border-2 border-primary rounded-md bg-background">
              <Lightbulb className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium">Tips</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInputsPanel />
        </TabsContent>

        <TabsContent value="prediction">
          <PredictionPanel />
        </TabsContent>

        <TabsContent value="growth">
          <GrowthLogPanel />
        </TabsContent>

        <TabsContent value="tips">
          <RecommendationsPanel />
        </TabsContent>
      </Tabs>
    </main>
  );
}

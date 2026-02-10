import { useState } from 'react';
import { PredictionLandingView } from './PredictionLandingView';
import { StandardPredictionView } from './StandardPredictionView';
import { PubertyStageEstimatorView } from './PubertyStageEstimatorView';

type PredictionView = 'landing' | 'standard' | 'puberty';

export function PredictionPanel() {
  const [currentView, setCurrentView] = useState<PredictionView>('landing');

  return (
    <div className="space-y-6">
      {currentView === 'landing' && (
        <PredictionLandingView
          onNavigateToStandard={() => setCurrentView('standard')}
          onNavigateToPuberty={() => setCurrentView('puberty')}
        />
      )}
      
      {currentView === 'standard' && (
        <StandardPredictionView onBack={() => setCurrentView('landing')} />
      )}
      
      {currentView === 'puberty' && (
        <PubertyStageEstimatorView onBack={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

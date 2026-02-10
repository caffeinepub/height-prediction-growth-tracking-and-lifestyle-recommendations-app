import { Wrench } from 'lucide-react';

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Wrench className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Under Maintenance
          </h1>
          <p className="text-lg text-muted-foreground">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check back shortly. We'll be back online soon.
          </p>
        </div>
        
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>Service temporarily unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

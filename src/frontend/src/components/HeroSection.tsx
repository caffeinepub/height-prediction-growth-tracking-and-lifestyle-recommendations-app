import { Ruler } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-chart-1/10 via-background to-chart-2/10 border-b">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/20 text-chart-1 text-sm font-medium">
              <Ruler className="h-4 w-4" />
              <span>Height Prediction & Growth Tracking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Track Your Growth Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Predict your adult height using multiple scientific formulas, track your growth over time, and get personalized recommendations for healthy development.
            </p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <img
              src="/assets/generated/hero-growth.dim_1600x900.png"
              alt="Height growth tracking illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

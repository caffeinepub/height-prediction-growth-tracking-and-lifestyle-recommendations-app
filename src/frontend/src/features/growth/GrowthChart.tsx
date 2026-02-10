import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HeightMeasurement } from '../../backend';

interface GrowthChartProps {
  logs: HeightMeasurement[];
}

export function GrowthChart({ logs }: GrowthChartProps) {
  const data = logs.map((log) => ({
    date: new Date(Number(log.timestamp) / 1000000).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    height: log.heightCm,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Chart</CardTitle>
        <CardDescription>Visual representation of your height over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
            />
            <YAxis
              label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--popover))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="height"
              stroke="oklch(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: 'oklch(var(--chart-1))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

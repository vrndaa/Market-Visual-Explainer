import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DeviceData } from '@/types/analytics';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface DeviceBreakdownChartProps {
  data: DeviceData[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // Mobile - blue
  '#10b981', // Desktop - emerald
  '#f59e0b'  // Tablet - amber
];

const deviceIcons: Record<string, typeof Smartphone> = {
  mobile: Smartphone,
  Mobile: Smartphone,
  desktop: Monitor,
  Desktop: Monitor,
  tablet: Tablet,
  Tablet: Tablet
};

export const DeviceBreakdownChart = ({ data, isLoading }: DeviceBreakdownChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          {data.map((item, index) => {
            const Icon = deviceIcons[item.device] || Monitor;
            const percentage = ((item.count / total) * 100).toFixed(1);
            
            return (
              <div key={item.device} className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${COLORS[index]}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: COLORS[index] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.device}</span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
              <XAxis 
                dataKey="device" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                formatter={(value: number) => [`${value}%`, 'Engagement Rate']}
              />
              <Bar 
                dataKey="engagement" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesData } from '@/types/analytics';
import { format, parseISO } from 'date-fns';

interface EngagementChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

export const EngagementChart = ({ data, isLoading }: EngagementChartProps) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM d')
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Engagement Trends</CardTitle>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
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
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                formatter={(value: number, name: string) => {
                  if (name === 'views') return [`${value.toLocaleString()}`, 'Page Views'];
                  if (name === 'engagement') return [`${value}%`, 'Engagement Rate'];
                  return [value.toLocaleString(), 'Visitors'];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => {
                  if (value === 'views') return 'Page Views';
                  if (value === 'engagement') return 'Engagement Rate';
                  return 'Visitors';
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="views" 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

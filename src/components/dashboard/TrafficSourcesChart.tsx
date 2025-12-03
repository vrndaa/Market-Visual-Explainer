import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Article } from '@/types/analytics';
import { useMemo } from 'react';

interface TrafficSourcesChartProps {
  articles: Article[];
  isLoading?: boolean;
}

const COLORS = [
  '#f59e0b', // Organic - amber
  '#3b82f6', // Social - blue
  '#10b981', // Direct - emerald
  '#8b5cf6'  // Referral - violet
];

export const TrafficSourcesChart = ({ articles, isLoading }: TrafficSourcesChartProps) => {
  const data = useMemo(() => {
    if (!articles.length) return [];
    
    const totals = articles.reduce((acc, article) => ({
      organic: acc.organic + article.trafficSources.organic,
      social: acc.social + article.trafficSources.social,
      direct: acc.direct + article.trafficSources.direct,
      referral: acc.referral + article.trafficSources.referral
    }), { organic: 0, social: 0, direct: 0, referral: 0 });

    const total = totals.organic + totals.social + totals.direct + totals.referral;
    
    return [
      { name: 'Organic Search', value: Math.round((totals.organic / total) * 100), raw: totals.organic },
      { name: 'Social Media', value: Math.round((totals.social / total) * 100), raw: totals.social },
      { name: 'Direct Traffic', value: Math.round((totals.direct / total) * 100), raw: totals.direct },
      { name: 'Referral', value: Math.round((totals.referral / total) * 100), raw: totals.referral }
    ];
  }, [articles]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={3}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  padding: '12px 16px'
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value: string) => (
                  <span className="text-sm text-foreground ml-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
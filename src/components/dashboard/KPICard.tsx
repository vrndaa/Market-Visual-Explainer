import { Card, CardContent } from '@/components/ui/card';
import { Eye, Clock, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: 'views' | 'time' | 'engagement' | 'users';
  isLoading?: boolean;
}

const iconMap = {
  views: Eye,
  time: Clock,
  engagement: Activity,
  users: Users,
};

export const KPICard = ({ title, value, change, icon, isLoading }: KPICardProps) => {
  const Icon = iconMap[icon];
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted/60 rounded" />
              <div className="h-10 w-10 bg-muted/60 rounded-xl" />
            </div>
            <div className="h-9 w-32 bg-muted/60 rounded" />
            <div className="h-4 w-20 bg-muted/60 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            {title}
          </span>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          
          <div className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-full",
            isPositive 
              ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" 
              : "text-rose-600 bg-rose-500/10 dark:text-rose-400"
          )}>
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
            <span className="text-muted-foreground font-normal">vs last period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
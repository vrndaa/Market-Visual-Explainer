import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Filter, Moon, Sun, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export const DashboardHeader = ({ onRefresh, onToggleFilters, showFilters }: DashboardHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container py-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Content Analytics
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-14">
              Real-time content performance and audience insights
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs py-1.5 px-3 bg-card/50 backdrop-blur-sm border-border/50">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live
            </Badge>
            
            <span className="text-xs text-muted-foreground hidden sm:inline px-2">
              Updated {formatTime(lastUpdated)}
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="lg:hidden h-9 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/30"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-200"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 w-9 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                className="h-9 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
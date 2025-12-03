import { useState } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { TrafficSourcesChart } from '@/components/dashboard/TrafficSourcesChart';
import { TopArticlesTable } from '@/components/dashboard/TopArticlesTable';
import { DeviceBreakdownChart } from '@/components/dashboard/DeviceBreakdownChart';
import { GeographicChart } from '@/components/dashboard/GeographicChart';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';
import { CohortRetentionTable } from '@/components/dashboard/CohortRetentionTable';
import { FiltersSidebar } from '@/components/dashboard/FiltersSidebar';
import { CategoryPerformanceChart } from '@/components/dashboard/CategoryPerformanceChart';
import { PeakTimesHeatmap } from '@/components/dashboard/PeakTimesHeatmap';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const Dashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const {
    articles,
    allArticles,
    kpis,
    timeSeriesData,
    geographicData,
    deviceData,
    cohorts,
    liveActivities,
    isLoading,
    filters,
    updateFilters,
    refreshData
  } = useAnalyticsData();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onRefresh={refreshData}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      
      <main className="container py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar 
                filters={filters}
                onFiltersChange={updateFilters}
              />
            </div>
          </aside>
          
          {/* Filters Sidebar - Mobile */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="left" className="w-80 p-0">
              <FiltersSidebar 
                filters={filters}
                onFiltersChange={updateFilters}
                onClose={() => setShowFilters(false)}
              />
            </SheetContent>
          </Sheet>
          
          {/* Main Content */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* KPI Cards */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                <KPICard
                  title="Total Page Views"
                  value={kpis ? formatNumber(kpis.totalViews) : '0'}
                  change={kpis?.viewsChange || 0}
                  icon="views"
                  isLoading={isLoading}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
                <KPICard
                  title="Avg. Time on Page"
                  value={kpis ? formatTime(kpis.avgTimeOnPage) : '0m 0s'}
                  change={kpis?.timeChange || 0}
                  icon="time"
                  isLoading={isLoading}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <KPICard
                  title="Engagement Rate"
                  value={kpis ? `${kpis.engagementRate.toFixed(1)}%` : '0%'}
                  change={kpis?.engagementChange || 0}
                  icon="engagement"
                  isLoading={isLoading}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                <KPICard
                  title="Active Users"
                  value={kpis ? formatNumber(kpis.activeUsers) : '0'}
                  change={kpis?.usersChange || 0}
                  icon="users"
                  isLoading={isLoading}
                />
              </div>
            </section>
            
            {/* Charts Row 1 */}
            <section className="grid gap-6 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <EngagementChart 
                data={timeSeriesData}
                isLoading={isLoading}
              />
              <TrafficSourcesChart 
                articles={allArticles}
                isLoading={isLoading}
              />
            </section>
            
            {/* Top Articles Table */}
            <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <TopArticlesTable 
                articles={articles}
                isLoading={isLoading}
              />
            </section>
            
            {/* Charts Row 2 */}
            <section className="grid gap-6 md:grid-cols-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <GeographicChart 
                data={geographicData}
                isLoading={isLoading}
              />
              <DeviceBreakdownChart 
                data={deviceData}
                isLoading={isLoading}
              />
            </section>
            
            {/* Charts Row 3 */}
            <section className="grid gap-6 md:grid-cols-2 animate-fade-in" style={{ animationDelay: '350ms' }}>
              <CategoryPerformanceChart 
                articles={allArticles}
                isLoading={isLoading}
              />
              <PeakTimesHeatmap 
                isLoading={isLoading}
              />
            </section>
            
            {/* Bottom Row */}
            <section className="grid gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CohortRetentionTable 
                cohorts={cohorts}
                isLoading={isLoading}
              />
              <LiveActivityFeed 
                activities={liveActivities}
                isLoading={isLoading}
              />
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Content Analytics Dashboard • Real-time performance tracking
            </p>
            <p className="text-xs text-muted-foreground">
              Data refreshes automatically every 3-5 seconds
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
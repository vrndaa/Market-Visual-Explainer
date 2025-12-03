import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Globe2, 
  Activity,
  Newspaper
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

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

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'traffic', label: 'Traffic', icon: TrendingUp },
  { id: 'content', label: 'Content', icon: Newspaper },
  { id: 'audience', label: 'Audience', icon: Globe2 },
  { id: 'engagement', label: 'Engagement', icon: Activity },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export const Dashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Total Page Views"
                  value={kpis ? formatNumber(kpis.totalViews) : '0'}
                  change={kpis?.viewsChange || 0}
                  icon="views"
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Avg. Time on Page"
                  value={kpis ? formatTime(kpis.avgTimeOnPage) : '0m 0s'}
                  change={kpis?.timeChange || 0}
                  icon="time"
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Engagement Rate"
                  value={kpis ? `${kpis.engagementRate.toFixed(1)}%` : '0%'}
                  change={kpis?.engagementChange || 0}
                  icon="engagement"
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Active Users"
                  value={kpis ? formatNumber(kpis.activeUsers) : '0'}
                  change={kpis?.usersChange || 0}
                  icon="users"
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.section>
            
            {/* Main Charts */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <EngagementChart 
                  data={timeSeriesData}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <TrafficSourcesChart 
                  articles={allArticles}
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.section>
            
            {/* Live Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LiveActivityFeed 
                activities={liveActivities}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        );
        
      case 'traffic':
        return (
          <motion.div
            key="traffic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <TrafficSourcesChart 
                  articles={allArticles}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DeviceBreakdownChart 
                  data={deviceData}
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.section>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PeakTimesHeatmap isLoading={isLoading} />
            </motion.div>
          </motion.div>
        );
        
      case 'content':
        return (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TopArticlesTable 
                articles={articles}
                isLoading={isLoading}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <CategoryPerformanceChart 
                articles={allArticles}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        );
        
      case 'audience':
        return (
          <motion.div
            key="audience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <GeographicChart 
                  data={geographicData}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DeviceBreakdownChart 
                  data={deviceData}
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.section>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CohortRetentionTable 
                cohorts={cohorts}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        );
        
      case 'engagement':
        return (
          <motion.div
            key="engagement"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <EngagementChart 
                  data={timeSeriesData}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PeakTimesHeatmap isLoading={isLoading} />
              </motion.div>
            </motion.section>
            
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <CohortRetentionTable 
                  cohorts={cohorts}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <LiveActivityFeed 
                  activities={liveActivities}
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.section>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onRefresh={refreshData}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container">
          <nav className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    "hover:bg-accent/50",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
      
      <main className="container py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-72 shrink-0"
          >
            <div className="sticky top-32">
              <FiltersSidebar 
                filters={filters}
                onFiltersChange={updateFilters}
              />
            </div>
          </motion.aside>
          
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
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-border/50 py-8 mt-16"
      >
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
      </motion.footer>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Article, 
  DashboardKPIs, 
  TimeSeriesData, 
  GeographicData, 
  DeviceData,
  Cohort,
  LiveActivity,
  FilterState 
} from '@/types/analytics';
import {
  generateArticles,
  generateKPIs,
  generateTimeSeriesData,
  generateGeographicData,
  generateDeviceData,
  generateCohorts,
  generateLiveActivity
} from '@/data/mockData';
import { toast } from 'sonner';

export const useAnalyticsData = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30d',
    startDate: null,
    endDate: null,
    categories: [],
    authors: [],
    devices: [],
    trafficSources: []
  });

  const fetchNews = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { query: 'news', pageSize: 50 }
      });

      if (error) {
        console.error('News fetch error:', error);
        return generateArticles(50);
      }

      return data?.articles || generateArticles(50);
    } catch (err) {
      console.error('News fetch error:', err);
      return generateArticles(50);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-analytics', {
        body: { startDate: '30daysAgo', endDate: 'today' }
      });

      if (error) {
        console.error('Analytics fetch error:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Analytics fetch error:', err);
      return null;
    }
  }, []);

  const mapAnalyticsToKPIs = (analyticsData: any): DashboardKPIs => ({
    totalViews: analyticsData.kpis?.totalViews || 0,
    avgTimeOnPage: analyticsData.kpis?.avgSessionDuration || 0,
    engagementRate: analyticsData.kpis?.bounceRate ? (100 - analyticsData.kpis.bounceRate * 100) : 50,
    activeUsers: analyticsData.kpis?.activeUsers || 0,
    viewsChange: analyticsData.kpis?.viewsChange || 0,
    timeChange: analyticsData.kpis?.sessionChange || 0,
    engagementChange: -1 * (analyticsData.kpis?.bounceChange || 0),
    usersChange: analyticsData.kpis?.visitorsChange || 0,
  });

  const mapTimeSeries = (data: any[]): TimeSeriesData[] => 
    data.map(item => ({
      date: item.date,
      views: item.pageViews || 0,
      engagement: Math.random() * 30 + 40, // GA4 doesn't provide direct engagement per day
      visitors: item.uniqueVisitors || 0,
    }));

  const mapDeviceData = (data: any[]): DeviceData[] =>
    data.map(item => ({
      device: item.device,
      count: item.users || 0,
      engagement: Math.random() * 20 + 50,
    }));

  // Initial data load
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      setIsLoading(true);

      const [newsData, analyticsData] = await Promise.all([
        fetchNews(),
        fetchAnalytics()
      ]);

      if (!mounted) return;

      // Set articles - use fetched or mock
      setArticles(newsData.length > 0 ? newsData : generateArticles(50));

      // Set analytics from API or use mock data
      if (analyticsData) {
        setKpis(mapAnalyticsToKPIs(analyticsData));

        if (analyticsData.timeSeries?.length > 0) {
          setTimeSeriesData(mapTimeSeries(analyticsData.timeSeries));
        } else {
          setTimeSeriesData(generateTimeSeriesData());
        }

        if (analyticsData.geographic?.length > 0) {
          setGeographicData(analyticsData.geographic.map((g: any) => ({
            ...g,
            percentage: 0,
          })));
        } else {
          setGeographicData(generateGeographicData());
        }

        if (analyticsData.devices?.length > 0) {
          setDeviceData(mapDeviceData(analyticsData.devices));
        } else {
          setDeviceData(generateDeviceData());
        }
      } else {
        // Use all mock data if analytics fetch failed
        setKpis(generateKPIs());
        setTimeSeriesData(generateTimeSeriesData());
        setGeographicData(generateGeographicData());
        setDeviceData(generateDeviceData());
      }

      // Use mock data for cohorts and live activity
      setCohorts(generateCohorts());
      setLiveActivities(Array.from({ length: 5 }, generateLiveActivity));
      
      setIsLoading(false);
    };

    loadData();
    
    return () => {
      mounted = false;
    };
  }, [fetchNews, fetchAnalytics]);

  // Real-time updates simulation for live activity
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      // Update KPIs slightly for real-time feel
      setKpis(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalViews: prev.totalViews + Math.floor(Math.random() * 10),
          activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 6) - 3)
        };
      });

      // Add new live activity
      setLiveActivities(prev => {
        const newActivity = generateLiveActivity();
        return [newActivity, ...prev.slice(0, 9)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Filtered articles based on current filters
  const filteredArticles = useCallback(() => {
    return articles.filter(article => {
      if (filters.categories.length > 0 && !filters.categories.includes(article.category)) {
        return false;
      }
      if (filters.authors.length > 0 && !filters.authors.includes(article.author)) {
        return false;
      }
      return true;
    });
  }, [articles, filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const [newsData, analyticsData] = await Promise.all([
      fetchNews(),
      fetchAnalytics()
    ]);

    setArticles(newsData.length > 0 ? newsData : generateArticles(50));

    if (analyticsData) {
      setKpis(mapAnalyticsToKPIs(analyticsData));
      if (analyticsData.timeSeries?.length > 0) {
        setTimeSeriesData(mapTimeSeries(analyticsData.timeSeries));
      } else {
        setTimeSeriesData(generateTimeSeriesData());
      }
      if (analyticsData.geographic?.length > 0) {
        setGeographicData(analyticsData.geographic.map((g: any) => ({
          ...g,
          percentage: 0,
        })));
      } else {
        setGeographicData(generateGeographicData());
      }
      if (analyticsData.devices?.length > 0) {
        setDeviceData(mapDeviceData(analyticsData.devices));
      } else {
        setDeviceData(generateDeviceData());
      }
    } else {
      setKpis(generateKPIs());
      setTimeSeriesData(generateTimeSeriesData());
      setGeographicData(generateGeographicData());
      setDeviceData(generateDeviceData());
    }

    toast.success('Data refreshed');
    setIsLoading(false);
  }, [fetchNews, fetchAnalytics]);

  return {
    articles: filteredArticles(),
    allArticles: articles,
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
  };
};

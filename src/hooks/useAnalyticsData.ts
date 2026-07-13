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
  FilterState,
} from '@/types/analytics';
import {
  generateArticles,
  generateKPIs,
  generateTimeSeriesData,
  generateGeographicData,
  generateDeviceData,
  generateCohorts,
  generateLiveActivity,
} from '@/data/mockData';
import { toast } from 'sonner';

// Shape returned by the fetch-analytics edge function (all fields optional so we
// can defensively fall back to generated sample data).
interface RawAnalytics {
  kpis?: {
    totalViews?: number;
    avgSessionDuration?: number;
    bounceRate?: number;
    activeUsers?: number;
    viewsChange?: number;
    sessionChange?: number;
    bounceChange?: number;
    visitorsChange?: number;
  };
  timeSeries?: { date: string; pageViews?: number; uniqueVisitors?: number }[];
  geographic?: { country: string; visitors: number }[];
  devices?: { device: string; users?: number }[];
  isMockData?: boolean;
}

const mapAnalyticsToKPIs = (a: RawAnalytics): DashboardKPIs => ({
  totalViews: a.kpis?.totalViews || 0,
  avgTimeOnPage: a.kpis?.avgSessionDuration || 0,
  engagementRate: a.kpis?.bounceRate ? 100 - a.kpis.bounceRate * 100 : 50,
  activeUsers: a.kpis?.activeUsers || 0,
  viewsChange: a.kpis?.viewsChange || 0,
  timeChange: a.kpis?.sessionChange || 0,
  engagementChange: -1 * (a.kpis?.bounceChange || 0),
  usersChange: a.kpis?.visitorsChange || 0,
});

const mapTimeSeries = (data: NonNullable<RawAnalytics['timeSeries']>): TimeSeriesData[] =>
  data.map((item) => ({
    date: item.date,
    views: item.pageViews || 0,
    // GA4 doesn't provide a per-day engagement metric, so this is a sample value.
    engagement: Math.random() * 30 + 40,
    visitors: item.uniqueVisitors || 0,
  }));

const mapGeographic = (data: NonNullable<RawAnalytics['geographic']>): GeographicData[] =>
  data.map((g) => ({ ...g, percentage: 0 }));

const mapDeviceData = (data: NonNullable<RawAnalytics['devices']>): DeviceData[] =>
  data.map((item) => ({
    device: item.device,
    count: item.users || 0,
    engagement: Math.random() * 20 + 50,
  }));

export const useAnalyticsData = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // True when any part of the dataset is generated sample data rather than a
  // live upstream source (drives the "Sample data" badge in the UI).
  const [isDemoData, setIsDemoData] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30d',
    startDate: null,
    endDate: null,
    categories: [],
    authors: [],
    devices: [],
    trafficSources: [],
  });

  const fetchNews = useCallback(async (): Promise<Article[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { query: 'news', pageSize: 50 },
      });
      if (error) {
        console.error('News fetch error:', error);
        return generateArticles(50);
      }
      return data?.articles?.length ? (data.articles as Article[]) : generateArticles(50);
    } catch (err) {
      console.error('News fetch error:', err);
      return generateArticles(50);
    }
  }, []);

  const fetchAnalytics = useCallback(async (): Promise<RawAnalytics | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-analytics', {
        body: { startDate: '30daysAgo', endDate: 'today' },
      });
      if (error) {
        console.error('Analytics fetch error:', error);
        return null;
      }
      return data as RawAnalytics;
    } catch (err) {
      console.error('Analytics fetch error:', err);
      return null;
    }
  }, []);

  // Single source of truth for turning the two API responses into dashboard
  // state — shared by the initial load and manual refresh.
  const applyData = useCallback((newsData: Article[], analytics: RawAnalytics | null) => {
    setArticles(newsData.length > 0 ? newsData : generateArticles(50));

    if (analytics) {
      setKpis(mapAnalyticsToKPIs(analytics));
      setTimeSeriesData(
        analytics.timeSeries?.length ? mapTimeSeries(analytics.timeSeries) : generateTimeSeriesData()
      );
      setGeographicData(
        analytics.geographic?.length ? mapGeographic(analytics.geographic) : generateGeographicData()
      );
      setDeviceData(
        analytics.devices?.length ? mapDeviceData(analytics.devices) : generateDeviceData()
      );
    } else {
      setKpis(generateKPIs());
      setTimeSeriesData(generateTimeSeriesData());
      setGeographicData(generateGeographicData());
      setDeviceData(generateDeviceData());
    }

    // Cohorts and live activity have no upstream source — always generated.
    setCohorts(generateCohorts());
    setLiveActivities(Array.from({ length: 5 }, generateLiveActivity));

    // We treat the view as "demo" unless analytics came back from a real source.
    setIsDemoData(!analytics || analytics.isMockData !== false);
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    const [newsData, analytics] = await Promise.all([fetchNews(), fetchAnalytics()]);
    applyData(newsData, analytics);
    setIsLoading(false);
  }, [fetchNews, fetchAnalytics, applyData]);

  // Initial data load
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [newsData, analytics] = await Promise.all([fetchNews(), fetchAnalytics()]);
      if (!mounted) return;
      applyData(newsData, analytics);
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [fetchNews, fetchAnalytics, applyData]);

  // Simulated live activity for a real-time feel (demo mode).
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setKpis((prev) =>
        prev
          ? {
              ...prev,
              totalViews: prev.totalViews + Math.floor(Math.random() * 10),
              activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 6) - 3),
            }
          : prev
      );
      setLiveActivities((prev) => [generateLiveActivity(), ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const filteredArticles = useCallback(
    () =>
      articles.filter((article) => {
        if (filters.categories.length > 0 && !filters.categories.includes(article.category)) return false;
        if (filters.authors.length > 0 && !filters.authors.includes(article.author)) return false;
        return true;
      }),
    [articles, filters]
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(async () => {
    await loadAll();
    toast.success('Data refreshed');
  }, [loadAll]);

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
    isDemoData,
    filters,
    updateFilters,
    refreshData,
  };
};

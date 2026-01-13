import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  topPages: Array<{ path: string; views: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
  devices: Array<{ device: string; percentage: number }>;
  dailyData: Array<{ date: string; visitors: number; pageviews: number }>;
}

export function useAnalytics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-analytics', {
        body: { startDate, endDate },
      });

      if (error) throw error;
      return data as AnalyticsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

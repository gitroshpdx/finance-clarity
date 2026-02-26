import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UsageRecord {
  id: string;
  cost_amount: number;
  feature_used: string;
  created_at: string;
  report_id: string | null;
}

interface AutoPublishUsage {
  totalPosts: number;
  costPerPost: number;
  outstandingAmount: number;
  usageRecords: UsageRecord[];
  loading: boolean;
}

const COST_PER_POST = 8;

export function useAutoPublishUsage(): AutoPublishUsage {
  const { user } = useAuth();
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUsageRecords([]);
      setLoading(false);
      return;
    }

    async function fetchUsage() {
      try {
        const { data, error } = await supabase
          .from('auto_publish_usage')
          .select('id, cost_amount, feature_used, created_at, report_id')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsageRecords(data || []);
      } catch (err) {
        console.error('Error fetching auto-publish usage:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, [user]);

  const totalPosts = usageRecords.length;
  const outstandingAmount = usageRecords.reduce((sum, r) => sum + Number(r.cost_amount), 0);

  return {
    totalPosts,
    costPerPost: COST_PER_POST,
    outstandingAmount,
    usageRecords,
    loading,
  };
}

export async function logAutoPublishUsage(
  userId: string,
  featureUsed: 'auto_publish' | 'one_click_publish',
  reportId?: string | null
) {
  const { error } = await supabase
    .from('auto_publish_usage')
    .insert({
      user_id: userId,
      feature_used: featureUsed,
      report_id: reportId || null,
      cost_amount: COST_PER_POST,
    });

  if (error) {
    console.error('Failed to log auto-publish usage:', error);
  }
}

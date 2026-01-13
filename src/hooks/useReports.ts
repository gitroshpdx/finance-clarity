import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DatabaseReport } from '@/types/report';

export function usePublishedReports(limit: number = 6) {
  return useQuery({
    queryKey: ['published-reports', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as DatabaseReport[];
    },
  });
}

export function useReportBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['report', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      return data as DatabaseReport | null;
    },
    enabled: !!slug,
  });
}

export function useRelatedReports(category: string, excludeId: string, limit: number = 3) {
  return useQuery({
    queryKey: ['related-reports', category, excludeId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', excludeId)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as DatabaseReport[];
    },
    enabled: !!category && !!excludeId,
  });
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const PROJECT_ID = Deno.env.get('SUPABASE_URL')?.match(/https:\/\/([^.]+)/)?.[1];

    if (!LOVABLE_API_KEY || !PROJECT_ID) {
      throw new Error('Missing API configuration');
    }

    // Fetch analytics from Lovable API
    const response = await fetch(
      `https://api.lovable.dev/v1/projects/${PROJECT_ID}/analytics?startdate=${startDate}&enddate=${endDate}&granularity=daily`,
      {
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Return mock/empty data if analytics not available
      return new Response(
        JSON.stringify({
          visitors: 0,
          pageviews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          pagesPerSession: 0,
          topPages: [],
          trafficSources: [],
          devices: [],
          dailyData: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    // Transform the analytics data
    const analyticsData = {
      visitors: data.visitors || 0,
      pageviews: data.pageviews || 0,
      bounceRate: data.bounceRate || 0,
      avgSessionDuration: data.avgSessionDuration || 0,
      pagesPerSession: data.pageviews && data.visitors ? data.pageviews / data.visitors : 0,
      topPages: data.topPages || [],
      trafficSources: data.trafficSources || [],
      devices: data.devices || [],
      dailyData: data.dailyData || data.data || [],
    };

    return new Response(
      JSON.stringify(analyticsData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Analytics error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        visitors: 0,
        pageviews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        pagesPerSession: 0,
        topPages: [],
        trafficSources: [],
        devices: [],
        dailyData: [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

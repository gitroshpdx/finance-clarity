import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = 'https://macrofinancereport.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/plain',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const urls: string[] = [];

    // Static pages
    const staticPaths = ['/', '/reports', '/about', '/contact', '/disclaimer', '/privacy', '/terms'];
    for (const path of staticPaths) {
      urls.push(`${SITE_URL}${path}`);
    }

    // Fetch all published reports with pagination
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;
    while (hasMore) {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('slug')
        .eq('status', 'published')
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        console.error('Error fetching reports:', error);
        break;
      }

      if (reports && reports.length > 0) {
        for (const report of reports) {
          urls.push(`${SITE_URL}/report/${report.slug}`);
        }
      }

      hasMore = (reports?.length ?? 0) === pageSize;
      page++;
    }

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('slug');

    if (catError) {
      console.error('Error fetching categories:', catError);
    } else if (categories) {
      for (const cat of categories) {
        urls.push(`${SITE_URL}/reports?category=${cat.slug}`);
      }
    }

    return new Response(urls.join('\n'), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`${SITE_URL}/`, {
      headers: corsHeaders,
      status: 200,
    });
  }
});

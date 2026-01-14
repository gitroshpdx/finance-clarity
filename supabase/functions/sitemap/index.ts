import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

const SITE_URL = 'https://macrofinancereport.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
    }

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, created_at');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    const today = new Date().toISOString().split('T')[0];

    // Static pages with priorities
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: '/reports', priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: '/about', priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: '/disclaimer', priority: '0.5', changefreq: 'yearly', lastmod: today },
      { loc: '/privacy', priority: '0.5', changefreq: 'yearly', lastmod: today },
      { loc: '/terms', priority: '0.5', changefreq: 'yearly', lastmod: today },
    ];

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add report pages
    if (reports && reports.length > 0) {
      for (const report of reports) {
        const lastmod = report.updated_at 
          ? new Date(report.updated_at).toISOString().split('T')[0]
          : today;
        xml += `  <url>
    <loc>${SITE_URL}/report/${report.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    // Add category pages
    if (categories && categories.length > 0) {
      for (const category of categories) {
        const lastmod = category.created_at 
          ? new Date(category.created_at).toISOString().split('T')[0]
          : today;
        xml += `  <url>
    <loc>${SITE_URL}/reports?category=${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: corsHeaders,
        status: 200,
      }
    );
  }
});

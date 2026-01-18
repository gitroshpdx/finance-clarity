import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Category to search query mapping - broader queries for more results
const categorySearchQueries: Record<string, string> = {
  "Markets": "stock market equities trading site:reuters.com OR site:bloomberg.com OR site:cnbc.com",
  "Economy": "economic GDP inflation employment site:reuters.com OR site:ft.com OR site:wsj.com",
  "Commodities": "oil gold commodities prices site:reuters.com OR site:marketwatch.com OR site:bloomberg.com",
  "Central Banks": "federal reserve ECB central bank interest rates monetary policy site:reuters.com OR site:ft.com OR site:bloomberg.com",
  "Crypto": "bitcoin cryptocurrency ethereum crypto market site:coindesk.com OR site:reuters.com OR site:bloomberg.com",
  "Geopolitics": "trade sanctions geopolitics international relations site:reuters.com OR site:ft.com OR site:bbc.com",
  "Technology": "tech stocks AI artificial intelligence technology site:reuters.com OR site:bloomberg.com OR site:techcrunch.com",
  "Real Estate": "real estate housing market mortgage rates property site:reuters.com OR site:bloomberg.com OR site:wsj.com",
};

// Quality validation thresholds
const QUALITY_THRESHOLDS = {
  minWordCount: 1500,
  minHeadings: 4,
  minDataPoints: 3,
  minKeyInsights: 2,
  minSourcesCited: 2,
  minOverallScore: 70,
};

interface QualityChecks {
  wordCount: { min: number; actual: number; passed: boolean };
  headingCount: { min: number; actual: number; passed: boolean };
  dataPointCount: { min: number; actual: number; passed: boolean };
  keyInsightCount: { min: number; actual: number; passed: boolean };
  hasConclusion: boolean;
  sourcesCited: { min: number; actual: number; passed: boolean };
  overallScore: number;
}

interface EEATSignals {
  sources_cited: number;
  data_verification_date: string;
  author_expertise_stated: boolean;
  forward_looking_disclaimer: boolean;
  methodology_included: boolean;
}

function calculateQualityScore(body: string, sourceCount: number): { qualityChecks: QualityChecks; eeatSignals: EEATSignals } {
  const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;
  const headingCount = (body.match(/^## /gm) || []).length;
  const dataPointCount = (body.match(/^> DATA:/gm) || []).length;
  const keyInsightCount = (body.match(/^> KEY:/gm) || []).length;
  const hasConclusion = body.toLowerCase().includes("## key takeaways") || body.toLowerCase().includes("## conclusion");
  
  // EEAT signals detection
  const hasMethodology = body.toLowerCase().includes("methodology") || body.toLowerCase().includes("## sources");
  const hasDisclaimer = body.toLowerCase().includes("forward-looking") || body.toLowerCase().includes("not financial advice");
  const hasExpertise = body.toLowerCase().includes("analysis by") || body.toLowerCase().includes("research team");
  const hasDataVerification = body.includes("Data as of") || body.includes("verified as of");
  
  const qualityChecks: QualityChecks = {
    wordCount: { min: QUALITY_THRESHOLDS.minWordCount, actual: wordCount, passed: wordCount >= QUALITY_THRESHOLDS.minWordCount },
    headingCount: { min: QUALITY_THRESHOLDS.minHeadings, actual: headingCount, passed: headingCount >= QUALITY_THRESHOLDS.minHeadings },
    dataPointCount: { min: QUALITY_THRESHOLDS.minDataPoints, actual: dataPointCount, passed: dataPointCount >= QUALITY_THRESHOLDS.minDataPoints },
    keyInsightCount: { min: QUALITY_THRESHOLDS.minKeyInsights, actual: keyInsightCount, passed: keyInsightCount >= QUALITY_THRESHOLDS.minKeyInsights },
    hasConclusion,
    sourcesCited: { min: QUALITY_THRESHOLDS.minSourcesCited, actual: sourceCount, passed: sourceCount >= QUALITY_THRESHOLDS.minSourcesCited },
    overallScore: 0,
  };
  
  // Calculate score
  let score = 0;
  if (qualityChecks.wordCount.passed) score += 20;
  if (qualityChecks.headingCount.passed) score += 15;
  if (qualityChecks.dataPointCount.passed) score += 15;
  if (qualityChecks.keyInsightCount.passed) score += 15;
  if (qualityChecks.hasConclusion) score += 10;
  if (qualityChecks.sourcesCited.passed) score += 15;
  
  // EEAT bonus (up to 10 points)
  let eeatBonus = 0;
  if (hasMethodology) eeatBonus += 2;
  if (hasDisclaimer) eeatBonus += 2;
  if (hasExpertise) eeatBonus += 2;
  if (hasDataVerification) eeatBonus += 2;
  if (sourceCount >= 3) eeatBonus += 2;
  score += eeatBonus;
  
  qualityChecks.overallScore = Math.min(score, 100);
  
  const eeatSignals: EEATSignals = {
    sources_cited: sourceCount,
    data_verification_date: new Date().toISOString().split('T')[0],
    author_expertise_stated: hasExpertise,
    forward_looking_disclaimer: hasDisclaimer,
    methodology_included: hasMethodology,
  };
  
  return { qualityChecks, eeatSignals };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, preview = false, publishData } = await req.json();

    // Handle publish/save actions for preview data
    if (publishData) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      const { data: insertedReport, error: insertError } = await supabase
        .from("reports")
        .insert({
          title: publishData.title,
          slug: publishData.slug,
          excerpt: publishData.excerpt,
          body: publishData.body,
          category: publishData.category,
          tags: publishData.tags,
          status: publishData.status,
          published_at: publishData.status === "published" ? new Date().toISOString() : null,
          word_count: publishData.wordCount,
          author_name: "MacroFinance AI Research",
          author_role: "AI-Assisted Analysis Team",
          source_urls: publishData.sourceUrls,
          quality_score: publishData.qualityScore,
          eeat_signals: publishData.eeatSignals,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", insertError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to save article to database" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          article: {
            id: insertedReport.id,
            title: insertedReport.title,
            slug: insertedReport.slug,
            category: insertedReport.category,
            wordCount: publishData.wordCount,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!category) {
      return new Response(
        JSON.stringify({ success: false, error: "Category is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Starting one-click publish for category: ${category}, preview: ${preview}`);

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Step 1: Check for duplicate sources from recent articles
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentArticles } = await supabase
      .from("reports")
      .select("source_urls")
      .eq("category", category)
      .gte("created_at", sevenDaysAgo.toISOString())
      .not("source_urls", "is", null);

    const usedUrls = new Set<string>();
    recentArticles?.forEach(article => {
      if (article.source_urls) {
        article.source_urls.forEach((url: string) => usedUrls.add(url));
      }
    });
    
    console.log(`Found ${usedUrls.size} used URLs from recent ${category} articles`);

    // Step 2: Search for latest news using Firecrawl with time-based filter
    const searchQuery = categorySearchQueries[category] || `${category} news site:reuters.com OR site:bloomberg.com`;
    console.log(`Searching for: ${searchQuery}`);

    // Helper function to search with a specific time filter
    const searchWithTimeFilter = async (query: string, tbs: string): Promise<any> => {
      const response = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 10, // Request more to filter out duplicates
          tbs, // Time-based filter
          scrapeOptions: {
            formats: ["markdown"],
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Firecrawl search error (tbs=${tbs}):`, errorText);
        return null;
      }

      return response.json();
    };

    // Try weekly filter first
    console.log("Searching with weekly filter (qdr:w)...");
    let searchData = await searchWithTimeFilter(searchQuery, "qdr:w");
    
    // If no results, try monthly filter as fallback
    if (!searchData?.data?.length) {
      console.log("No results in last week, trying monthly filter (qdr:m)...");
      searchData = await searchWithTimeFilter(searchQuery, "qdr:m");
    }

    // If still no results, try without time filter as last resort
    if (!searchData?.data?.length) {
      console.log("No results in last month, trying without time filter...");
      searchData = await searchWithTimeFilter(searchQuery, "");
    }

    console.log(`Found ${searchData?.data?.length || 0} articles`);

    if (!searchData?.data || searchData.data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No news articles found for this category. Please try a different category." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 3: Filter out duplicate sources
    const uniqueArticles = searchData.data.filter(
      (article: any) => article.url && !usedUrls.has(article.url)
    );

    if (uniqueArticles.length < 2) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Not enough unique sources available. Please try again later or choose a different category." 
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Take top 3 unique articles
    const selectedArticles = uniqueArticles.slice(0, 3);
    const sourceUrls = selectedArticles.map((a: any) => a.url);

    // Step 4: Combine scraped content
    const rawNewsContent = selectedArticles
      .map((article: any, index: number) => {
        return `
=== SOURCE ${index + 1} ===
Title: ${article.title || "Unknown"}
URL: ${article.url || "Unknown"}
Content:
${article.markdown || article.description || "No content available"}
`;
      })
      .join("\n\n");

    console.log("Combined content length:", rawNewsContent.length);

    // Step 5: Generate premium article using AI with EEAT compliance
    const systemPrompt = `You are an elite financial journalist creating premium macro finance articles for a professional readership. Your articles are data-rich, insightful, and follow Google's EEAT guidelines (Experience, Expertise, Authoritativeness, Trustworthiness).

ARTICLE REQUIREMENTS:
1. Create a compelling, SEO-optimized title (under 80 characters)
2. Write an engaging excerpt (under 200 characters)
3. Generate 5-8 relevant tags as an array
4. Write a comprehensive article body (1800-2500 words minimum)

BODY FORMATTING - Use these REQUIRED markers:
- "> KEY: [insight text]" for key insight callouts (MUST use 3-4 per article)
- "> DATA: [stat]" for important statistics/data points (MUST use 4-5 per article)
- Use ## for section headers (MUST have at least 5 sections)
- Use **bold** for emphasis on key terms
- Use bullet points for lists
- MUST include a "## Key Takeaways" section at the end

EEAT COMPLIANCE (REQUIRED):
1. Start with "Analysis by MacroFinance Research Team" byline with brief expertise statement
2. Cite sources explicitly: "According to [Source Name]..." or "[Source] reports that..."
3. Include "Data verified as of [today's date]" for key statistics
4. Add this disclaimer before Key Takeaways: "**Disclaimer:** This analysis contains forward-looking statements and should not be considered financial advice."
5. End with a "## Sources & Methodology" section listing the sources consulted
6. Never present AI analysis as definitive human expert opinion - use phrases like "analysis suggests" or "data indicates"

WRITING STYLE:
- Professional, authoritative tone befitting institutional finance
- Data-driven analysis with specific numbers and percentages
- Forward-looking insights with clear reasoning
- Balance technical depth with accessibility
- Original synthesis beyond source material

OUTPUT: Return a structured JSON response with title, excerpt, tags, and body fields.`;

    const userPrompt = `Transform this raw news data into a premium ${category} analysis article that meets all EEAT and quality requirements:

${rawNewsContent}

CRITICAL Requirements:
- Synthesize information from ALL provided sources
- Add original analysis and forward-looking commentary
- Include at least 4-5 specific data points with "> DATA:" markers
- Include at least 3-4 key insights with "> KEY:" markers
- Create at least 5 section headings with ##
- Include the EEAT compliance elements (byline, source citations, disclaimer, methodology section)
- Minimum 1800 words for the body
- End with ## Key Takeaways section

Today's date for data verification: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    console.log("Calling AI to generate EEAT-compliant article...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_article",
              description: "Create a premium EEAT-compliant financial article with structured data",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "SEO-optimized article title under 80 characters",
                  },
                  excerpt: {
                    type: "string",
                    description: "Engaging excerpt under 200 characters",
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "5-8 relevant tags for the article",
                  },
                  body: {
                    type: "string",
                    description: "Full article body with KEY and DATA markers, EEAT elements, minimum 1800 words",
                  },
                },
                required: ["title", "excerpt", "tags", "body"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_article" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI error:", errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate article" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    // Extract tool call arguments
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ success: false, error: "AI did not return structured data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const article = JSON.parse(toolCall.function.arguments);
    console.log("Parsed article:", article.title);

    // Step 6: Calculate quality score and EEAT signals
    const { qualityChecks, eeatSignals } = calculateQualityScore(article.body, sourceUrls.length);
    
    console.log(`Quality score: ${qualityChecks.overallScore}/100`);

    // Step 7: Generate slug
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 80) + "-" + Date.now().toString(36);

    // Step 8: Return preview data or publish directly
    if (preview) {
      return new Response(
        JSON.stringify({
          success: true,
          preview: true,
          data: {
            title: article.title,
            excerpt: article.excerpt,
            body: article.body,
            tags: article.tags,
            category: category,
            slug: slug,
            wordCount: qualityChecks.wordCount.actual,
            sourceUrls: sourceUrls,
            qualityChecks: qualityChecks,
            eeatSignals: eeatSignals,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Direct publish (legacy mode)
    if (qualityChecks.overallScore < QUALITY_THRESHOLDS.minOverallScore) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Article quality score (${qualityChecks.overallScore}) is below the minimum threshold (${QUALITY_THRESHOLDS.minOverallScore}). Please try regenerating.`,
          qualityChecks: qualityChecks,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: insertedReport, error: insertError } = await supabase
      .from("reports")
      .insert({
        title: article.title,
        slug: slug,
        excerpt: article.excerpt,
        body: article.body,
        category: category,
        tags: article.tags,
        status: "published",
        published_at: new Date().toISOString(),
        word_count: qualityChecks.wordCount.actual,
        author_name: "MacroFinance AI Research",
        author_role: "AI-Assisted Analysis Team",
        source_urls: sourceUrls,
        quality_score: qualityChecks.overallScore,
        eeat_signals: eeatSignals,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save article to database" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Article published successfully:", insertedReport.id);

    return new Response(
      JSON.stringify({
        success: true,
        article: {
          id: insertedReport.id,
          title: insertedReport.title,
          slug: insertedReport.slug,
          category: insertedReport.category,
          wordCount: qualityChecks.wordCount.actual,
          qualityScore: qualityChecks.overallScore,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("One-click publish error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

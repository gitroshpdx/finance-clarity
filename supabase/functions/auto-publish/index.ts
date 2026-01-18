import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AutoPublishRequest {
  raw_news_data: string;
  publish_date: string;
  region_tags: string[];
  market_context?: {
    indices?: string;
    commodities?: string;
    forex?: string;
    rates?: string;
    earnings?: string;
  };
  auto_publish?: boolean;
}

interface GeneratedArticle {
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  category: string;
  region_tags: string[];
  summary_3_points: string[];
  article_body: string;
  sources: string[];
  seo_keywords: string[];
  estimated_read_time_minutes: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const requestData: AutoPublishRequest = await req.json();
    const { raw_news_data, publish_date, region_tags, market_context, auto_publish } = requestData;

    if (!raw_news_data || !publish_date) {
      return new Response(
        JSON.stringify({ error: "raw_news_data and publish_date are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing auto-publish request for date:", publish_date);
    console.log("Region tags:", region_tags);
    console.log("Auto publish:", auto_publish);

    // Build market context string
    let marketContextStr = "";
    if (market_context) {
      const parts = [];
      if (market_context.indices) parts.push(`Indices: ${market_context.indices}`);
      if (market_context.commodities) parts.push(`Commodities: ${market_context.commodities}`);
      if (market_context.forex) parts.push(`Forex: ${market_context.forex}`);
      if (market_context.rates) parts.push(`Rates: ${market_context.rates}`);
      if (market_context.earnings) parts.push(`Earnings: ${market_context.earnings}`);
      marketContextStr = parts.join("\n");
    }

    const systemPrompt = `You are an elite financial analyst and editorial content generator. Your job is to take raw finance/market/news data and transform it into premium-grade digestible articles.

CRITICAL RULES:
- Tone must be clear, professional, structured, and data-driven
- NO clickbait, NO inventing data, NO fake numbers
- Never fabricate statistics; if something is missing, use "not disclosed" or "data not available"
- Explain financial jargon in parentheses (e.g., CPI (Consumer Price Index), PMI (Purchasing Managers Index), FOMC (Federal Open Market Committee))
- Add context: historical values, geopolitical impact, sector impact
- Generate relevant SEO keywords from the content

OUTPUT FORMAT:
You must call the generate_article function with all required fields. The article_body should use premium formatting:

- Use > KEY: for critical insights
- Use > DATA: value | label | context for statistics
- Use > "quote" for notable quotes
- Use > RISK: or > WARNING: for risk callouts
- Use > TAKEAWAY: for section summaries
- Use markdown tables for comparisons
- Structure sections as: ## What Happened, ## Why It Matters, ## Market Reaction, ## Broader Context, ## Looking Ahead (omit sections if not relevant)

Calculate estimated_read_time_minutes based on word count (average 200 words per minute).`;

    const userPrompt = `Transform this raw news data into a premium financial article:

[RAW_NEWS_DATA]
${raw_news_data}

[PUBLISH_DATE]
${publish_date}

[REGION/COUNTRY TAGS]
${region_tags?.join(", ") || "Global"}

[MARKET CONTEXT IF AVAILABLE]
${marketContextStr || "Not provided"}

Generate the article now using the generate_article function.`;

    // Use tool calling for structured output
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              name: "generate_article",
              description: "Generate a structured financial article from raw news data",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "SEO-optimized headline, max 80 characters" 
                  },
                  subtitle: { 
                    type: "string", 
                    description: "Supporting subtitle with key context" 
                  },
                  slug: { 
                    type: "string", 
                    description: "URL-friendly slug, lowercase with hyphens" 
                  },
                  date: { 
                    type: "string", 
                    description: "Publication date in YYYY-MM-DD format" 
                  },
                  category: { 
                    type: "string", 
                    enum: ["Markets", "Economy", "Geopolitics", "Central Banks", "Tech", "Crypto"],
                    description: "Primary category for the article" 
                  },
                  region_tags: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Geographic regions covered" 
                  },
                  summary_3_points: { 
                    type: "array", 
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                    description: "Three key takeaways from the article" 
                  },
                  article_body: { 
                    type: "string", 
                    description: "Full article content with premium formatting (> KEY:, > DATA:, tables, etc.)" 
                  },
                  sources: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "List of source names referenced" 
                  },
                  seo_keywords: { 
                    type: "array", 
                    items: { type: "string" },
                    minItems: 5,
                    maxItems: 10,
                    description: "SEO keywords for the article" 
                  },
                  estimated_read_time_minutes: { 
                    type: "number", 
                    description: "Estimated reading time in minutes" 
                  },
                },
                required: [
                  "title", "subtitle", "slug", "date", "category", 
                  "region_tags", "summary_3_points", "article_body", 
                  "sources", "seo_keywords", "estimated_read_time_minutes"
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_article") {
      throw new Error("Invalid response from AI - no tool call found");
    }

    const generatedArticle: GeneratedArticle = JSON.parse(toolCall.function.arguments);
    console.log("Generated article:", generatedArticle.title);

    // If auto_publish is true, insert into database
    let dbResult = null;
    if (auto_publish) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Calculate word count from article body
      const wordCount = generatedArticle.article_body.split(/\s+/).length;

      // Prepare the report data
      const reportData = {
        title: generatedArticle.title,
        slug: generatedArticle.slug,
        category: generatedArticle.category,
        body: generatedArticle.article_body,
        excerpt: generatedArticle.summary_3_points[0],
        tags: [...generatedArticle.seo_keywords, ...generatedArticle.region_tags],
        status: "published",
        published_at: new Date().toISOString(),
        word_count: wordCount,
        author_name: "AI Editorial Team",
        author_role: "Automated Analysis",
      };

      console.log("Inserting report into database...");
      const { data, error } = await supabase
        .from("reports")
        .insert(reportData)
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      dbResult = data;
      console.log("Report inserted with ID:", data.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        article: generatedArticle,
        published: auto_publish || false,
        report_id: dbResult?.id || null,
        report_slug: dbResult?.slug || generatedArticle.slug,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Auto-publish error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

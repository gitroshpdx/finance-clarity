import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Category to search query mapping for news scraping
const categorySearchQueries: Record<string, string> = {
  "Markets": "stock market equities trading today site:reuters.com OR site:bloomberg.com",
  "Economy": "economic GDP inflation employment today site:reuters.com OR site:ft.com",
  "Commodities": "oil gold commodities prices today site:reuters.com OR site:marketwatch.com",
  "Central Banks": "federal reserve ECB interest rates monetary policy site:reuters.com OR site:ft.com",
  "Crypto": "bitcoin cryptocurrency ethereum today site:coindesk.com OR site:reuters.com",
  "Geopolitics": "trade sanctions geopolitics international site:reuters.com OR site:ft.com",
  "Technology": "tech stocks AI artificial intelligence site:reuters.com OR site:bloomberg.com",
  "Real Estate": "real estate housing market mortgage rates site:reuters.com OR site:bloomberg.com",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();

    if (!category) {
      return new Response(
        JSON.stringify({ success: false, error: "Category is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Starting one-click publish for category: ${category}`);

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

    // Step 1: Search for latest news using Firecrawl
    const searchQuery = categorySearchQueries[category] || `${category} news today site:reuters.com`;
    console.log(`Searching for: ${searchQuery}`);

    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Firecrawl search error:", errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to search for news articles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchResponse.json();
    console.log(`Found ${searchData.data?.length || 0} articles`);

    if (!searchData.data || searchData.data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No news articles found for this category" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Combine scraped content
    const rawNewsContent = searchData.data
      .slice(0, 3)
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

    // Step 3: Generate premium article using AI
    const systemPrompt = `You are an elite financial journalist creating premium macro finance articles. Your articles are data-rich, insightful, and feature sophisticated formatting.

ARTICLE REQUIREMENTS:
1. Create a compelling, SEO-optimized title (under 80 characters)
2. Write an engaging excerpt (under 200 characters)
3. Generate 5-8 relevant tags as an array
4. Write a comprehensive article body (1500-2500 words)

BODY FORMATTING - Use these special markers:
- "> KEY: [label]" for key insight callouts (use 2-3 per article)
- "> DATA: [stat]" for important statistics/data points (use 3-5 per article)
- Use ## for section headers
- Use **bold** for emphasis on key terms
- Use bullet points for lists
- Include a "## Key Takeaways" section at the end

WRITING STYLE:
- Professional, authoritative tone
- Data-driven analysis with specific numbers
- Forward-looking insights and implications
- Balance technical depth with accessibility

OUTPUT: Return a structured JSON response with title, excerpt, tags, and body fields.`;

    const userPrompt = `Transform this raw news data into a premium ${category} analysis article:

${rawNewsContent}

Requirements:
- Synthesize information from multiple sources
- Add analysis and forward-looking commentary
- Include specific data points and statistics
- Create original insights beyond the source material
- Format with KEY and DATA callouts as specified`;

    console.log("Calling AI to generate article...");

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
              description: "Create a premium financial article with structured data",
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
                    description: "Full article body with KEY and DATA markers, 1500-2500 words",
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

    // Step 4: Generate slug
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 80) + "-" + Date.now().toString(36);

    // Step 5: Calculate word count
    const wordCount = article.body.split(/\s+/).length;

    // Step 6: Insert into database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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
        word_count: wordCount,
        author_name: "MacroFinance AI",
        author_role: "AI Research Team",
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
          wordCount: wordCount,
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

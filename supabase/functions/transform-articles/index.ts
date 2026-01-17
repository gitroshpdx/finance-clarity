import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all published reports
    const { data: reports, error: fetchError } = await supabase
      .from("reports")
      .select("id, title, body, category")
      .eq("status", "published");

    if (fetchError) throw fetchError;

    const transformPrompt = `You are a content formatter. Transform the following article body to use premium formatting elements.

FORMATTING RULES:
1. Identify 2-3 key insights and wrap them with: > KEY: [insight text]
2. Find key statistics/data points and format as: > DATA: [value] | [label] | [context]
3. Find notable quotes or important statements and format as: > "[quote text]" - [source if known, or omit]
4. If there are comparison points, create a markdown table
5. Ensure bullet lists use - prefix
6. Add > TAKEAWAY: at the end of major sections
7. Add > RISK: for any cautionary statements

Keep ALL existing content - just add the formatting markers where appropriate. Do not remove any text.
Keep ## section headings exactly as they are.

Return ONLY the transformed body text, nothing else.`;

    const results = [];

    for (const report of reports || []) {
      console.log(`Transforming: ${report.title}`);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: transformPrompt },
            { role: "user", content: `Article title: ${report.title}\nCategory: ${report.category}\n\nBody to transform:\n\n${report.body}` },
          ],
          max_tokens: 8000,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to transform ${report.title}: ${response.status}`);
        results.push({ id: report.id, title: report.title, status: "error", error: `API error: ${response.status}` });
        continue;
      }

      const data = await response.json();
      const transformedBody = data.choices?.[0]?.message?.content;

      if (!transformedBody) {
        results.push({ id: report.id, title: report.title, status: "error", error: "No content returned" });
        continue;
      }

      // Update the report
      const { error: updateError } = await supabase
        .from("reports")
        .update({ body: transformedBody, updated_at: new Date().toISOString() })
        .eq("id", report.id);

      if (updateError) {
        results.push({ id: report.id, title: report.title, status: "error", error: updateError.message });
      } else {
        results.push({ id: report.id, title: report.title, status: "success" });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(JSON.stringify({ 
      message: "Transformation complete", 
      total: reports?.length || 0,
      results 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("transform-articles error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

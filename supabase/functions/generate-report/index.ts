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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check admin role using has_role RPC
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { topic, category, sources, wordCount, additionalInstructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert financial analyst and writer for MacroFinance Report, a premium intelligence publication. Write comprehensive, well-researched financial reports in the style of Goldman Sachs research notes or The Economist intelligence briefings.

CRITICAL FORMAT INSTRUCTIONS - Use these special markdown elements:

1. KEY INSIGHTS (use for important takeaways):
> KEY: This is the most important insight that readers should remember.

2. DATA CALLOUTS (use for key statistics - format: value | label | context):
> DATA: 4.5% | Projected Inflation | Expected Q3/Q4 2026 based on commodity trends

3. PULL QUOTES (use for notable statements or findings):
> "Notable quote or key finding that deserves emphasis" - Source Name

4. TABLES (use for comparisons and data):
| Factor | Current | Outlook |
|--------|---------|---------|
| GDP Growth | 6.2% | Stable |
| Inflation | 4.1% | Rising |

5. BULLET LISTS (use for multiple related points):
- First key point with analysis
- Second point with supporting data
- Third point with implications

6. WARNINGS/RISKS (use for cautionary notes):
> RISK: This highlights a potential risk factor investors should monitor.

7. TAKEAWAYS (use at the end of sections for summaries):
> TAKEAWAY: The key actionable insight from this section that readers should act upon.

STRUCTURE YOUR REPORT AS:
1. A compelling # Title
2. Opening executive summary paragraph (2-3 sentences)
3. Multiple ## Section headings with:
   - Opening context paragraph
   - Key insight callout (> KEY:)
   - Supporting analysis with data
   - Data callout for key statistics (> DATA:)
   - Pull quotes where relevant
   - Tables for comparisons
   - Risk factors if applicable (> RISK:)
   - Section takeaway (> TAKEAWAY:)
4. Final ## Conclusion with outlook

STYLE GUIDELINES:
- Professional, authoritative tone
- Data-driven with specific numbers
- Balanced analysis with multiple perspectives
- Clear section headings (##)
- Use the special formatting elements liberally - at least 2-3 per section`;

    const userPrompt = `Write a ${wordCount}-word premium financial intelligence report on:

Topic: ${topic}
Category: ${category}
${sources?.length ? `Reference sources:\n${sources.join('\n')}` : ''}
${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}

Remember to use the special formatting elements (> KEY:, > DATA:, > "quotes", tables, > RISK:, > TAKEAWAY:) throughout the report. Start with a # title.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

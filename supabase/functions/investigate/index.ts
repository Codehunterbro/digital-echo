import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a digital identity intelligence system. Given a username or identity query, generate a realistic and plausible (but fictional) digital identity profile. Respond ONLY with valid JSON matching this exact structure — no markdown, no explanation.

The JSON must have these fields:
{
  "name": "Full display name",
  "username": "primary username",
  "avatar": "2-letter initials",
  "riskScore": number 0-100,
  "behavioral": {
    "sleepPattern": "e.g. 1:00 AM – 8:30 AM",
    "activeHours": "e.g. 10:00 AM – 2:00 AM",
    "avgDailyScreenTime": "e.g. 6.4 hrs",
    "sentiment": [
      { "label": "emotion name", "value": number (percentage), "color": "hsl(...)" }
    ] (5 items, values must sum to 100),
    "websiteVisits": [
      { "site": "domain", "frequency": "Daily/Weekly/etc" }
    ] (3-5 items)
  },
  "location": {
    "locality": "neighborhood/district",
    "city": "city name",
    "country": "country name",
    "timezone": "e.g. IST (UTC+5:30)",
    "isp": "internet service provider name",
    "geoPatterns": ["pattern description"] (2-4 items)
  },
  "personal": {
    "fullName": "full legal-style name",
    "aliases": ["username1", "username2"] (3-5 items),
    "bio": "short bio description",
    "email": "partially masked email",
    "phone": "partially masked phone",
    "avatarUrl": ""
  },
  "social": [
    {
      "platform": "Platform Name",
      "username": "platform_username",
      "confidence": number 50-99,
      "followers": number,
      "posts": number,
      "lastActive": "e.g. 2 hours ago",
      "color": "hsl(...)",
      "recentActivity": [
        { "type": "Post/Comment/Tweet/etc", "content": "description", "date": "relative time", "engagement": number }
      ] (2-3 items per platform)
    }
  ] (exactly 6 platforms: Reddit, GitHub, X (Twitter), LinkedIn, YouTube, Instagram)
}

Use these exact HSL colors for social platforms:
- Reddit: hsl(16, 100%, 50%)
- GitHub: hsl(0, 0%, 75%)
- X (Twitter): hsl(210, 10%, 80%)
- LinkedIn: hsl(210, 80%, 50%)
- YouTube: hsl(0, 100%, 50%)
- Instagram: hsl(330, 80%, 55%)

For sentiment colors use varied hsl values. Make the profile feel realistic and contextually appropriate to the queried username.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate a digital identity profile for the username/identity: "${query}"`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Strip markdown code fences if present
    const jsonStr = content.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
    const personData = JSON.parse(jsonStr);

    return new Response(JSON.stringify(personData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("investigate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

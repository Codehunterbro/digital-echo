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
    const { fullName, location, interests, profession } = await req.json();
    if (!fullName || typeof fullName !== "string") {
      return new Response(JSON.stringify({ error: "Missing fullName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an OSINT (Open Source Intelligence) researcher specializing in social media reconnaissance. Given a person's full name and optional filters (location, interests, profession), generate a realistic plausible (fictional but believable) shortlist of social media profiles that could belong to that person.

Respond ONLY with valid JSON (no markdown, no commentary) matching this exact structure:

{
  "subject": {
    "fullName": "string",
    "location": "string or null",
    "interests": "string or null",
    "profession": "string or null"
  },
  "summary": "2-3 sentence overview of the search and findings",
  "overallConfidence": number 0-100,
  "verdict": "Confirmed Match" | "Likely Match" | "Possible Match" | "No Confirmed Match",
  "profiles": [
    {
      "platform": "Instagram" | "Facebook" | "LinkedIn" | "Twitter (X)" | "Snapchat" | "TikTok" | "YouTube" | "Reddit" | "GitHub",
      "username": "handle (no @)",
      "displayName": "name shown on profile",
      "url": "plausible profile URL",
      "avatarHint": "short description of profile photo (e.g. 'professional headshot, brown hair')",
      "bio": "short bio text from profile",
      "location": "location shown on profile",
      "followers": number or null,
      "following": number or null,
      "posts": number or null,
      "lastActive": "e.g. '2 days ago'",
      "verified": boolean,
      "confidence": number 0-100,
      "matchingIndicators": ["bullet point reasons it likely matches", ...] (2-5 items),
      "inconsistencies": ["bullet point red flags / mismatches", ...] (0-3 items),
      "status": "Shortlisted" | "Eliminated" | "Needs Review"
    }
  ] (5-8 profiles across different platforms; mix shortlisted and eliminated),
  "crossChecks": [
    "string describing a cross-platform correlation finding"
  ] (3-5 items),
  "recommendations": [
    "next step the researcher should take"
  ] (2-4 items),
  "disclaimer": "short ethical-use disclaimer"
}

Guidelines:
- Be realistic. Common names should yield lower confidence and more eliminated profiles.
- Use the location/profession/interests filters to bias the matching indicators.
- Eliminated profiles should explain WHY (wrong location, wrong age, different profession, etc).
- If the name is extremely common with no strong filters, set verdict to "No Confirmed Match" and overallConfidence below 40.
- URLs should follow real platform URL conventions but the accounts are fictional.`;

    const userPrompt = `Find social media profiles for:

Full Name: ${fullName}
Location: ${location || "(not specified)"}
Interests: ${interests || "(not specified)"}
Profession: ${profession || "(not specified)"}

Conduct the OSINT investigation and return the JSON report.`;

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
            { role: "user", content: userPrompt },
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

    const jsonStr = content.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
    const report = JSON.parse(jsonStr);

    return new Response(JSON.stringify(report), {
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

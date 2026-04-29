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
    const { fullName, location, interests, profession, knownUsernames } = await req.json();
    if (!fullName || typeof fullName !== "string") {
      return new Response(JSON.stringify({ error: "Missing fullName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert OSINT researcher. Given a person's full name and optional details, identify possible WORKING and PUBLIC social media profiles that align with the description, and CROSS-LINK accounts via bio/about-section links between platforms.

CRITICAL RULES:
- Only include profiles that would realistically be public and working (no broken / private / suspended links).
- URLs must follow real platform URL conventions (linkedin.com/in/<slug>, instagram.com/<user>, x.com/<user>, youtube.com/@<user>, facebook.com/<user>, github.com/<user>, etc.).
- If multiple distinct people share the name, SEPARATE them into distinct groups (Person A, Person B, ...). Never merge different people.
- Only include groups that match at least some of the provided details (location, profession, interests, known usernames).
- Each group MUST have at least 3 verified data points (e.g. profile photo match, username similarity, location, job/education, bio keywords, follower overlap, posted content).
- Each group's connectionExplanation MUST describe HOW the profiles cross-link (e.g. "LinkedIn 'Contact info' links Instagram handle, which links YouTube in bio").
- crossLinkedAccounts are accounts discovered specifically via the bio/external link of another verifiedProfile in the same group — describe in discoveredVia.
- If no group strongly matches the provided details, return groups: [] and noConfirmedMatch: true.
- Confidence: "High" only when 4+ strong indicators align across 3+ platforms; "Medium" for 3 indicators / 2 platforms; "Low" otherwise.

Respond ONLY with valid JSON (no markdown, no commentary) matching this exact structure:

{
  "subject": {
    "fullName": "string",
    "location": "string or null",
    "interests": "string or null",
    "profession": "string or null",
    "knownUsernames": "string or null"
  },
  "summary": "2-3 sentence overview of the investigation and how many distinct individuals matched",
  "noConfirmedMatch": boolean,
  "groups": [
    {
      "groupName": "Person A",
      "displayName": "name as it appears on the matched profiles",
      "summary": "1-2 sentence description of who this person appears to be",
      "matchedDetails": {
        "location": "string or null",
        "profession": "string or null",
        "education": "string or null",
        "interests": "string or null",
        "company": "string or null"
      },
      "verifiedProfiles": [
        {
          "platform": "LinkedIn" | "Instagram" | "Twitter (X)" | "Facebook" | "YouTube" | "Snapchat" | "TikTok" | "GitHub" | "Reddit" | "Website",
          "username": "handle without @",
          "url": "full working profile URL",
          "verified": boolean,
          "bioExcerpt": "short snippet from bio (optional)"
        }
      ],
      "crossLinkedAccounts": [
        {
          "platform": "string",
          "url": "full URL",
          "discoveredVia": "e.g. 'Linked from LinkedIn contact section', 'Listed in Instagram bio'"
        }
      ],
      "verifiedDataPoints": ["at least 3 concrete matching signals"],
      "connectionExplanation": "explain how these profiles are tied together via cross-platform links",
      "confidence": "High" | "Medium" | "Low"
    }
  ],
  "disclaimer": "short ethical-use disclaimer (one sentence)"
}

Return 1-3 groups when matches exist. Aim for 3-5 verifiedProfiles per group across different platforms.`;

    const userPrompt = `Investigate possible social media profiles for:

Full Name: ${fullName}
Location: ${location || "(not specified)"}
Profession / Education: ${profession || "(not specified)"}
Interests / Company / Other identifiers: ${interests || "(not specified)"}
Known usernames / handles: ${knownUsernames || "(not specified)"}

Prioritize working public profiles, cross-link accounts via bio/external links, separate distinct individuals into groups, and only include groups matching at least some of the details above. Return the JSON report.`;

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

    // Normalize URLs so every link is clickable and opens the actual platform
    const buildUrl = (platform: string, username: string): string => {
      const u = (username || "").replace(/^@+/, "").trim();
      if (!u) return "";
      const p = (platform || "").toLowerCase();
      if (p.includes("linkedin")) return `https://www.linkedin.com/in/${u}`;
      if (p.includes("instagram")) return `https://www.instagram.com/${u}`;
      if (p.includes("twitter") || p === "x") return `https://x.com/${u}`;
      if (p.includes("facebook")) return `https://www.facebook.com/${u}`;
      if (p.includes("youtube")) return `https://www.youtube.com/@${u}`;
      if (p.includes("tiktok")) return `https://www.tiktok.com/@${u}`;
      if (p.includes("github")) return `https://github.com/${u}`;
      if (p.includes("reddit")) return `https://www.reddit.com/user/${u}`;
      if (p.includes("snapchat")) return `https://www.snapchat.com/add/${u}`;
      return "";
    };

    const normalizeUrl = (url: string, platform: string, username = ""): string => {
      let raw = (url || "").trim();
      if (!raw) return buildUrl(platform, username);
      // strip markdown / brackets / trailing punctuation
      raw = raw.replace(/[<>()\[\]"']/g, "").replace(/[.,;]+$/, "");
      if (raw.startsWith("//")) raw = "https:" + raw;
      if (!/^https?:\/\//i.test(raw)) {
        if (/^[\w.-]+\.[a-z]{2,}/i.test(raw)) raw = "https://" + raw;
        else return buildUrl(platform, username || raw);
      }
      try {
        const parsed = new URL(raw);
        return parsed.toString();
      } catch {
        return buildUrl(platform, username);
      }
    };

    if (Array.isArray(report.groups)) {
      for (const g of report.groups) {
        if (Array.isArray(g.verifiedProfiles)) {
          g.verifiedProfiles = g.verifiedProfiles
            .map((p: any) => ({ ...p, url: normalizeUrl(p.url, p.platform, p.username) }))
            .filter((p: any) => !!p.url);
        }
        if (Array.isArray(g.crossLinkedAccounts)) {
          g.crossLinkedAccounts = g.crossLinkedAccounts
            .map((c: any) => ({ ...c, url: normalizeUrl(c.url, c.platform) }))
            .filter((c: any) => !!c.url);
        }
      }
    }

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

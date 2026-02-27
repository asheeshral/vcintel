import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

// Groq client — key stays on server, never exposed to client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── helpers ────────────────────────────────────────────────────────────────

/** Fetch a URL server-side (no CORS), strip HTML, return plain text + metadata */
async function scrape(url: string): Promise<{
  url: string;
  text: string;
  ok: boolean;
  status: number | null;
  ms: number;
  chars: number;
}> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VCIntel-Enrichment/1.0; +https://vcintel.io)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });

    const html = await res.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000);

    return {
      url,
      text,
      ok: res.ok,
      status: res.status,
      ms: Date.now() - start,
      chars: text.length,
    };
  } catch {
    return {
      url,
      text: "",
      ok: false,
      status: null,
      ms: Date.now() - start,
      chars: 0,
    };
  }
}

// ── POST /api/enrich ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse + validate request body
  let company: {
    id: string;
    name: string;
    domain: string;
    description: string;
    sector: string;
    stage: string;
    raised: string;
    website: string;
  };

  try {
    const body = await req.json();
    company = body.company;
    if (!company?.name || !company?.website) {
      return NextResponse.json(
        { error: "Missing required company fields" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 2. Scrape pages server-side (no CORS issues here)
  const urlsToScrape = [
    company.website,
    `${company.website}/about`,
    `${company.website}/product`,
  ];

  const scrapedPages = await Promise.all(urlsToScrape.map(scrape));

  const goodPages = scrapedPages.filter((p) => p.ok && p.chars > 80);
  const webContext =
    goodPages.length > 0
      ? goodPages.map((p) => `## ${p.url}\n${p.text}`).join("\n\n")
      : "(No pages successfully scraped — rely on company metadata only)";

  // 3. LLM call via Groq (free tier — Llama 3.3 70B)
  let parsed: Record<string, unknown>;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1024,
      response_format: { type: "json_object" }, // enforces valid JSON output
      messages: [
        {
          role: "system",
          content:
            "You are a VC research analyst specialising in deep tech and AI. " +
            "Respond ONLY with valid JSON matching the exact shape requested. No markdown fences, no preamble.",
        },
        {
          role: "user",
          content: `Analyse this company for a deep tech / AI VC fund.

Company metadata:
Name: ${company.name}
Domain: ${company.domain}
Description: ${company.description}
Sector: ${company.sector}
Stage: ${company.stage}
Raised: ${company.raised}

Scraped web content:
${webContext}

Return ONLY this JSON shape:
{
  "summary": "2 sentences max",
  "what_they_do": ["bullet", "bullet", "bullet"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "signals": [{"signal": "...", "type": "positive|neutral|risk"}],
  "thesis_fit": "1 sentence on fit with deep tech / AI thesis"
}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (err) {
    return NextResponse.json(
      { error: `LLM call failed: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  // 4. Return structured JSON — sources include full scrape metadata
  return NextResponse.json({
    ...parsed,
    sources: scrapedPages.map((p) => ({
      url: p.url,
      ok: p.ok,
      status: p.status,
      chars: p.chars,
      ms: p.ms,
      scraped_at: new Date().toISOString(),
    })),
    _enriched_at: new Date().toISOString(),
  });
}

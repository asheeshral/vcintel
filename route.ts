import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // never exposed to client
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
        // polite scraper UA — avoids bot-blocking on many sites
        "User-Agent":
          "Mozilla/5.0 (compatible; VCIntel-Enrichment/1.0; +https://vcintel.io)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6000),
      // Next.js: opt out of caching so we always get fresh HTML
      cache: "no-store",
    });

    const html = await res.text();

    // Extract meaningful text — strip scripts, styles, tags; collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000); // 2k chars per page is plenty for LLM context

    return {
      url,
      text,
      ok: res.ok,
      status: res.status,
      ms: Date.now() - start,
      chars: text.length,
    };
  } catch (err) {
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

  // 3. LLM call — key stays on server via process.env
  let parsed: Record<string, unknown>;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "You are a VC research analyst specialising in deep tech and AI. " +
        "Respond ONLY with valid JSON. No markdown fences, no preamble, no trailing text.",
      messages: [
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

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "{}";
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

# VCIntel — AI-Powered VC Research Platform

A Next.js app that enriches startup profiles by scraping their public websites server-side and running the content through Claude.

## Architecture

```
Browser                     Server (Next.js)              External
──────────────────          ─────────────────────         ──────────────
EnrichmentPanel.tsx
  POST /api/enrich  ──────▶ app/api/enrich/route.ts
                              ├── fetch(company.website)  ──▶ startup site
                              ├── fetch(.../about)        ──▶ startup site
                              ├── fetch(.../product)      ──▶ startup site
                              ├── strip HTML → plain text
                              └── anthropic.messages.create ──▶ Anthropic API
                    ◀──────  return structured JSON
  render result
```

**Key security property**: The Anthropic API key never leaves the server. The browser only ever calls `/api/enrich` on your own domain.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set your API key
cp .env.local.example .env.local
# edit .env.local and add your ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key from console.anthropic.com |

## Deployment (Vercel)

```bash
vercel deploy
```

Add `ANTHROPIC_API_KEY` in your Vercel project's Environment Variables settings.  
**Do not** add it to your codebase or expose it client-side.

## Project Structure

```
vcintel/
├── app/
│   ├── api/
│   │   └── enrich/
│   │       └── route.ts        # ← THE server-side endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── EnrichmentPanel.tsx     # ← client; only calls /api/enrich
├── .env.local.example          # copy → .env.local, never commit
├── .gitignore
└── README.md
```

## What `/api/enrich` does

1. Receives `{ company }` in POST body
2. Scrapes `company.website`, `/about`, `/product` server-side (no CORS issues)
3. Strips HTML → plain text (scripts, styles, tags removed)
4. Sends metadata + scraped text to Claude via `@anthropic-ai/sdk`
5. Returns structured JSON: `{ summary, what_they_do, keywords, signals, thesis_fit, sources[] }`

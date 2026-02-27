"use client";

import { useState, useEffect } from "react";

type Source = {
  url: string;
  ok: boolean;
  status: number | null;
  chars: number;
  ms: number;
  scraped_at: string;
};

type EnrichmentResult = {
  summary: string;
  what_they_do: string[];
  keywords: string[];
  signals: { signal: string; type: "positive" | "neutral" | "risk" }[];
  thesis_fit: string;
  sources: Source[];
  _enriched_at: string;
};

type Company = {
  id: string;
  name: string;
  domain: string;
  description: string;
  sector: string;
  stage: string;
  raised: string;
  website: string;
};

function Tag({ label }: { label: string }) {
  return (
    <span style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>
      {label}
    </span>
  );
}

export default function EnrichmentPanel({ company }: { company: Company }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<EnrichmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`enrich_${company.id}`);
      if (cached) {
        setData(JSON.parse(cached));
        setState("done");
      }
    } catch {}
  }, [company.id]);

  async function handleEnrich() {
    setState("loading");
    setError(null);

    try {
      // ── The client ONLY calls our own API route ──────────────────────────
      // No Anthropic SDK, no API key, no dangerous headers.
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const result: EnrichmentResult = await res.json();
      setData(result);
      setState("done");

      // Cache result
      try {
        localStorage.setItem(`enrich_${company.id}`, JSON.stringify(result));
      } catch {}
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  const scrapedCount = data?.sources?.filter((s) => s.ok && s.chars > 80).length ?? 0;

  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Live Enrichment
          </span>
          {data && (
            <span style={{ fontSize: 10, color: "#22c55e", background: "#052e1622", borderRadius: 4, padding: "1px 6px" }}>
              ● live
            </span>
          )}
          {data && scrapedCount > 0 && (
            <span style={{ fontSize: 10, color: "#38bdf8", background: "#0c2a3a", border: "1px solid #164e6333", borderRadius: 4, padding: "1px 6px" }}>
              {scrapedCount} page{scrapedCount !== 1 ? "s" : ""} scraped
            </span>
          )}
        </div>
        <button
          onClick={state === "loading" ? undefined : handleEnrich}
          style={{ background: state === "loading" ? "#1e293b" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: state === "loading" ? "#64748b" : "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: state === "loading" ? "wait" : "pointer" }}
        >
          {state === "loading" ? "Enriching…" : state === "done" ? "↻ Re-Enrich" : "⚡ Enrich"}
        </button>
      </div>

      {/* Idle */}
      {state === "idle" && (
        <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔬</div>
          <div style={{ fontSize: 13 }}>Click Enrich to pull live intelligence from public web pages</div>
          <div style={{ fontSize: 11, color: "#334155", marginTop: 6, fontFamily: "monospace" }}>
            POST /api/enrich → scrape → LLM → JSON
          </div>
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6366f1", marginBottom: 6 }}>Fetching pages server-side…</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, fontFamily: "monospace" }}>
            {company.website} · /about · /product
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: `pulse 1.2s ${i * 0.4}s infinite ease-in-out` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 8 }}>⚠ Enrichment failed</div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", background: "#1e293b", borderRadius: 6, padding: "6px 12px", display: "inline-block" }}>
            {error}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleEnrich} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Done */}
      {state === "done" && data && (
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Summary</div>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13, lineHeight: 1.7 }}>{data.summary}</p>
          </div>

          {data.thesis_fit && (
            <div style={{ background: "#6366f111", border: "1px solid #6366f133", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Thesis Fit</div>
              <p style={{ margin: 0, color: "#a5b4fc", fontSize: 12 }}>{data.thesis_fit}</p>
            </div>
          )}

          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>What They Do</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {data.what_they_do?.map((b, i) => (
                <li key={i} style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Keywords</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.keywords?.map((k, i) => <Tag key={i} label={k} />)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Derived Signals</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.signals?.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: s.type === "positive" ? "#052e1622" : s.type === "risk" ? "#4c071622" : "#1e293b", borderRadius: 8, padding: "8px 12px", border: `1px solid ${s.type === "positive" ? "#22c55e22" : s.type === "risk" ? "#ef444422" : "#334155"}` }}>
                  <span style={{ fontSize: 12 }}>{s.type === "positive" ? "✅" : s.type === "risk" ? "⚠️" : "ℹ️"}</span>
                  <span style={{ color: "#cbd5e1", fontSize: 12 }}>{s.signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scraped Sources */}
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Scraped Sources
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {data.sources?.map((src, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "10px 1fr auto auto auto", gap: "6px 10px", alignItems: "center", background: "#020817", border: `1px solid ${src.ok && src.chars > 80 ? "#1e3a2f" : "#2a1a1a"}`, borderRadius: 6, padding: "7px 12px" }}>
                  <span style={{ fontSize: 9, color: src.ok && src.chars > 80 ? "#22c55e" : "#ef4444" }}>
                    {src.ok && src.chars > 80 ? "●" : "○"}
                  </span>
                  <a href={src.url} target="_blank" rel="noreferrer" style={{ color: src.ok && src.chars > 80 ? "#6366f1" : "#475569", fontSize: 11, fontFamily: "monospace", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {src.url}
                  </a>
                  <span style={{ fontSize: 10, color: "#64748b", whiteSpace: "nowrap" }}>
                    {src.status ?? "—"}
                  </span>
                  <span style={{ fontSize: 10, color: "#475569", whiteSpace: "nowrap" }}>
                    {src.chars > 0 ? `${src.chars.toLocaleString()} chars` : "empty"}
                  </span>
                  <span style={{ fontSize: 10, color: "#334155", whiteSpace: "nowrap" }}>
                    {src.ms}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {data._enriched_at && (
            <div style={{ fontSize: 10, color: "#334155", textAlign: "right" }}>
              Enriched {new Date(data._enriched_at).toLocaleString()}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{transform:scale(0.8);opacity:0.4}50%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  );
}

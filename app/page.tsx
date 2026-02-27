"use client";

import { useState, useEffect } from "react";
import EnrichmentPanel from "@/components/EnrichmentPanel";

const MOCK_COMPANIES = [
  { id: "1", name: "Cognify Labs", domain: "cognifylabs.ai", stage: "Seed", sector: "AI Infrastructure", hq: "San Francisco, CA", founded: 2022, employees: "11-50", raised: "$4.2M", score: 94, tags: ["LLM", "DevTools", "B2B"], website: "https://cognifylabs.ai", description: "Developer tooling layer for production LLM applications with built-in evals, caching, and observability.", signals: [{ date: "2024-01-15", type: "funding", text: "Raised $4.2M seed led by Sequoia" }, { date: "2024-02-01", type: "hiring", text: "5 new ML engineer roles posted" }, { date: "2024-02-20", type: "product", text: "Launched public beta" }] },
  { id: "2", name: "NeuralFlow", domain: "neuralflow.io", stage: "Series A", sector: "MLOps", hq: "New York, NY", founded: 2021, employees: "51-100", raised: "$18M", score: 88, tags: ["MLOps", "Enterprise", "Cloud"], website: "https://neuralflow.io", description: "End-to-end MLOps platform that helps data teams ship models 10x faster with automated pipelines.", signals: [{ date: "2024-01-08", type: "funding", text: "Series A $18M led by a16z" }, { date: "2024-01-25", type: "partnership", text: "AWS partnership announced" }] },
  { id: "3", name: "Synthos AI", domain: "synthos.ai", stage: "Pre-Seed", sector: "Synthetic Data", hq: "Austin, TX", founded: 2023, employees: "1-10", raised: "$1.1M", score: 82, tags: ["Synthetic Data", "Privacy", "FinTech"], website: "https://synthos.ai", description: "Generates high-fidelity synthetic datasets for AI training while preserving privacy guarantees.", signals: [{ date: "2024-02-10", type: "funding", text: "Pre-seed $1.1M from Y Combinator" }, { date: "2024-02-18", type: "product", text: "API v2 launch with 50+ data schemas" }] },
  { id: "4", name: "VectorDB Inc", domain: "vectordb.dev", stage: "Series B", sector: "AI Infrastructure", hq: "Seattle, WA", founded: 2020, employees: "101-250", raised: "$45M", score: 79, tags: ["Vector DB", "Search", "Open Source"], website: "https://vectordb.dev", description: "Open-source vector database optimized for billion-scale similarity search with sub-millisecond latency.", signals: [{ date: "2023-12-01", type: "funding", text: "Series B $45M" }, { date: "2024-01-10", type: "product", text: "10,000 GitHub stars milestone" }] },
  { id: "5", name: "PromptLayer", domain: "promptlayer.com", stage: "Seed", sector: "DevTools", hq: "Boston, MA", founded: 2022, employees: "11-50", raised: "$6.8M", score: 76, tags: ["Prompt Eng", "Observability", "SaaS"], website: "https://promptlayer.com", description: "Middleware for tracking, managing, and optimizing LLM prompts across models and providers.", signals: [{ date: "2024-01-20", type: "hiring", text: "CTO hire from OpenAI" }, { date: "2024-02-05", type: "product", text: "Launched prompt versioning" }] },
  { id: "6", name: "Meridian AI", domain: "meridian.ai", stage: "Series A", sector: "AI Safety", hq: "San Francisco, CA", founded: 2021, employees: "51-100", raised: "$22M", score: 91, tags: ["AI Safety", "Alignment", "Research"], website: "https://meridian.ai", description: "Applied AI safety tooling for enterprise model auditing, red-teaming, and compliance.", signals: [{ date: "2024-02-12", type: "funding", text: "Series A $22M" }, { date: "2024-02-25", type: "press", text: "Featured in MIT Tech Review" }] },
  { id: "7", name: "Refract Bio", domain: "refractbio.com", stage: "Seed", sector: "BioAI", hq: "Cambridge, MA", founded: 2023, employees: "1-10", raised: "$3.5M", score: 85, tags: ["BioAI", "Drug Discovery", "Deep Tech"], website: "https://refractbio.com", description: "Applying protein language models to accelerate small molecule drug discovery pipelines.", signals: [{ date: "2024-01-30", type: "funding", text: "$3.5M seed from Flagship" }, { date: "2024-02-15", type: "hiring", text: "Head of Research hire" }] },
  { id: "8", name: "Quanta Edge", domain: "quantaedge.io", stage: "Pre-Seed", sector: "Quantum ML", hq: "Chicago, IL", founded: 2023, employees: "1-10", raised: "$800K", score: 71, tags: ["Quantum", "ML", "Deep Tech"], website: "https://quantaedge.io", description: "Hybrid quantum-classical ML algorithms for optimization problems in logistics and supply chain.", signals: [{ date: "2024-02-01", type: "funding", text: "$800K pre-seed" }] },
];

type Company = (typeof MOCK_COMPANIES)[0];

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
const SECTORS = ["AI Infrastructure", "MLOps", "Synthetic Data", "DevTools", "AI Safety", "BioAI", "Quantum ML"];
const SIGNAL_ICONS: Record<string, string> = { funding: "💰", hiring: "👥", product: "🚀", partnership: "🤝", press: "📰" };

const scoreColor = (s: number) => s >= 90 ? "#22c55e" : s >= 75 ? "#f59e0b" : "#64748b";
const stageColor = (s: string) => ({ "Pre-Seed": "#7c3aed", "Seed": "#2563eb", "Series A": "#0891b2", "Series B": "#059669", "Series C+": "#dc2626" }[s] || "#64748b");

function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setVal(JSON.parse(s));
    } catch { }
  }, [key]);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
  }, [key, val]);
  return [val, setVal];
}

function ScoreBadge({ score }: { score: number }) {
  return <span style={{ display: "inline-flex", alignItems: "center", background: `${scoreColor(score)}22`, color: scoreColor(score), border: `1px solid ${scoreColor(score)}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{score}</span>;
}
function StagePill({ stage }: { stage: string }) {
  return <span style={{ background: `${stageColor(stage)}18`, color: stageColor(stage), border: `1px solid ${stageColor(stage)}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{stage}</span>;
}
function Tag({ label }: { label: string }) {
  return <span style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{label}</span>;
}
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return <div style={{ width: size, height: size, borderRadius: size / 3, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{name[0]}</div>;
}

function CompanyProfile({ company, lists, onAddToList, onBack, notes, setNotes }: {
  company: Company;
  lists: { id: string; name: string; companies: Company[] }[];
  onAddToList: (listId: string, company: Company) => void;
  onBack: () => void;
  notes: Record<string, string>;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [note, setNote] = useState(notes[company.id] || "");
  const [tab, setTab] = useState("overview");
  const [noteSaved, setNoteSaved] = useState(false);

  function saveNote() {
    setNotes(p => ({ ...p, [company.id]: note }));
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>← Back to Companies</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Avatar name={company.name} size={48} />
            <div>
              <h2 style={{ margin: "0 0 2px", color: "#f1f5f9", fontSize: 24, fontFamily: "'DM Serif Display',Georgia,serif" }}>{company.name}</h2>
              <a href={company.website} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 12, textDecoration: "none" }}>{company.domain} ↗</a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <StagePill stage={company.stage} />
            {company.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ScoreBadge score={company.score} />
          <select onChange={e => { if (e.target.value) onAddToList(e.target.value, company); e.target.value = ""; }}
            style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
            <option value="">+ Add to List</option>
            {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
        {([["Founded", company.founded], ["Employees", company.employees], ["Raised", company.raised], ["HQ", company.hq]] as [string, string | number][]).map(([k, v]) => (
          <div key={k} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{k}</div>
            <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1e293b" }}>
        {["overview", "signals", "notes", "enrich"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#6366f1" : "transparent"}`, color: tab === t ? "#6366f1" : "#64748b", padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {t}{t === "enrich" ? " ⚡" : ""}
          </button>
        ))}
      </div>
      {tab === "overview" && <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{company.description}</p>}
      {tab === "signals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {company.signals.map((sig, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 20, minWidth: 32, textAlign: "center" }}>{SIGNAL_ICONS[sig.type] || "📌"}</div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{sig.text}</div>
                <div style={{ color: "#475569", fontSize: 11 }}>{sig.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "notes" && (
        <div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your research notes here…"
            style={{ width: "100%", minHeight: 140, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 10, padding: 14, fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", outline: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <button onClick={saveNote} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Note</button>
            {noteSaved && <span style={{ color: "#22c55e", fontSize: 12 }}>✓ Saved</span>}
          </div>
        </div>
      )}
      {tab === "enrich" && <EnrichmentPanel company={company} />}
    </div>
  );
}

function CompaniesPage({ onSelect, savedCompanies, setSavedCompanies }: {
  onSelect: (c: Company) => void;
  savedCompanies: Company[];
  setSavedCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string[]>([]);
  const [sort, setSort] = useState({ key: "score", dir: "desc" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = MOCK_COMPANIES.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)))
      && (!stageFilter.length || stageFilter.includes(c.stage))
      && (!sectorFilter.length || sectorFilter.includes(c.sector));
  }).sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "name") return dir * a.name.localeCompare(b.name);
    return dir * ((a as any)[sort.key] - (b as any)[sort.key]);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  function toggleSort(key: string) { setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }); }
  function toggleFilter(arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) { setArr(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]); setPage(1); }
  const isSaved = (id: string) => savedCompanies.some(c => c.id === id);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 26 }}>Companies</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{filtered.length} companies · Deep Tech / AI & ML thesis</p>
      </div>
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, sector, tag…"
        style={{ width: "100%", maxWidth: 440, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none", marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Stage</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STAGES.map(s => <button key={s} onClick={() => toggleFilter(stageFilter, setStageFilter, s)} style={{ background: stageFilter.includes(s) ? stageColor(s) : "#1e293b", color: stageFilter.includes(s) ? "#fff" : "#94a3b8", border: `1px solid ${stageFilter.includes(s) ? stageColor(s) : "#334155"}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{s}</button>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Sector</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SECTORS.map(s => <button key={s} onClick={() => toggleFilter(sectorFilter, setSectorFilter, s)} style={{ background: sectorFilter.includes(s) ? "#6366f1" : "#1e293b", color: sectorFilter.includes(s) ? "#fff" : "#94a3b8", border: `1px solid ${sectorFilter.includes(s) ? "#6366f1" : "#334155"}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{s}</button>)}
          </div>
        </div>
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#070c1a" }}>
              {[["Company", "name"], ["Sector", null], ["Stage", null], ["Raised", "raised"], ["Score", "score"], ["", null]].map(([label, key]) => (
                <th key={label as string} onClick={key ? () => toggleSort(key as string) : undefined}
                  style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: sort.key === key ? "#6366f1" : "#475569", fontWeight: 600, cursor: key ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap" }}>
                  {label}{key && sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid #1e293b", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1e293b44")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 16px" }} onClick={() => onSelect(c)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={c.name} size={32} />
                    <div>
                      <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ color: "#475569", fontSize: 11 }}>{c.domain}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 12 }} onClick={() => onSelect(c)}>{c.sector}</td>
                <td style={{ padding: "12px 16px" }} onClick={() => onSelect(c)}><StagePill stage={c.stage} /></td>
                <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 12, fontFamily: "monospace" }} onClick={() => onSelect(c)}>{c.raised}</td>
                <td style={{ padding: "12px 16px" }} onClick={() => onSelect(c)}><ScoreBadge score={c.score} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => setSavedCompanies(p => isSaved(c.id) ? p.filter(x => x.id !== c.id) : [...p, c])}
                    style={{ background: "none", border: `1px solid ${isSaved(c.id) ? "#f59e0b" : "#334155"}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: isSaved(c.id) ? "#f59e0b" : "#64748b", cursor: "pointer" }}>
                    {isSaved(c.id) ? "★" : "☆"}
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#475569", fontSize: 13 }}>No companies match your filters.</td></tr>}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#475569", fontSize: 12 }}>Page {page} of {pages}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: "#1e293b", border: "1px solid #334155", color: page === 1 ? "#334155" : "#94a3b8", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages} style={{ background: "#1e293b", border: "1px solid #334155", color: page >= pages ? "#334155" : "#94a3b8", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: page >= pages ? "not-allowed" : "pointer" }}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListsPage({ lists, setLists }: { lists: { id: string; name: string; companies: Company[] }[]; setLists: React.Dispatch<React.SetStateAction<{ id: string; name: string; companies: Company[] }[]>> }) {
  const [newName, setNewName] = useState("");
  function createList() { if (!newName.trim()) return; setLists(p => [...p, { id: Date.now().toString(), name: newName.trim(), companies: [] }]); setNewName(""); }
  function removeFromList(listId: string, companyId: string) { setLists(p => p.map(l => l.id === listId ? { ...l, companies: l.companies.filter(c => c.id !== companyId) } : l)); }
  function deleteList(listId: string) { setLists(p => p.filter(l => l.id !== listId)); }
  function exportList(list: { name: string; companies: Company[] }, fmt: string) {
    let content: string, type: string, ext: string;
    if (fmt === "json") { content = JSON.stringify(list.companies, null, 2); type = "application/json"; ext = "json"; }
    else { const h = ["name", "domain", "stage", "sector", "raised", "score"]; content = [h.join(","), ...list.companies.map(c => h.map(k => `"${(c as any)[k] || ""}"`).join(","))].join("\n"); type = "text/csv"; ext = "csv"; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = `${list.name}.${ext}`; a.click();
  }
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 26 }}>Lists</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Organise and export company collections</p>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && createList()} placeholder="New list name…"
          style={{ flex: 1, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none" }} />
        <button onClick={createList} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create</button>
      </div>
      {lists.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: 60 }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>No lists yet.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {lists.map(list => (
          <div key={list.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: list.companies.length ? "1px solid #1e293b" : "none" }}>
              <div><span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{list.name}</span><span style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>{list.companies.length} co.</span></div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => exportList(list, "csv")} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>↓ CSV</button>
                <button onClick={() => exportList(list, "json")} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>↓ JSON</button>
                <button onClick={() => deleteList(list.id)} style={{ background: "#1e293b", border: "1px solid #334155", color: "#ef4444", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
            {list.companies.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderTop: "1px solid #1e293b44" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={c.name} size={28} /><span style={{ color: "#e2e8f0", fontSize: 13 }}>{c.name}</span><StagePill stage={c.stage} /></div>
                <button onClick={() => removeFromList(list.id, c.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            ))}
            {list.companies.length === 0 && <div style={{ padding: "12px 20px", color: "#475569", fontSize: 12 }}>Add companies from the Companies page.</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedPage({ savedCompanies, setSavedCompanies, onSelect }: { savedCompanies: Company[]; setSavedCompanies: React.Dispatch<React.SetStateAction<Company[]>>; onSelect: (c: Company) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 26 }}>Saved</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{savedCompanies.length} companies bookmarked</p>
      </div>
      {savedCompanies.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: 60 }}><div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>No saved companies yet.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {savedCompanies.map(c => (
          <div key={c.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1e293b44")} onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={() => onSelect(c)}>
              <Avatar name={c.name} size={36} />
              <div>
                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{c.sector} · {c.hq}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ScoreBadge score={c.score} /><StagePill stage={c.stage} />
              <button onClick={() => setSavedCompanies(p => p.filter(x => x.id !== c.id))} style={{ background: "none", border: "1px solid #334155", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#64748b", cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("companies");
  const [selected, setSelected] = useState<Company | null>(null);
  const [lists, setLists] = useLocalStorage<{ id: string; name: string; companies: Company[] }[]>("vc_lists", []);
  const [savedCompanies, setSavedCompanies] = useLocalStorage<Company[]>("vc_saved", []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>("vc_notes", {});
  const [collapsed, setCollapsed] = useState(false);

  function addToList(listId: string, company: Company) {
    setLists(p => p.map(l => l.id === listId && !l.companies.find(c => c.id === company.id) ? { ...l, companies: [...l.companies, company] } : l));
  }
  function navTo(p: string) { setPage(p); setSelected(null); }
  const NAV = [{ id: "companies", icon: "🏢", label: "Companies" }, { id: "lists", icon: "📋", label: "Lists" }, { id: "saved", icon: "⭐", label: "Saved" }];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020817", overflow: "hidden" }}>
      <aside style={{ width: collapsed ? 60 : 210, flexShrink: 0, background: "#070c1a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden" }}>
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          {!collapsed && <div><div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>VCIntel</div><div style={{ color: "#818cf8", fontSize: 10, whiteSpace: "nowrap" }}>AI Scout</div></div>}
        </div>
        <nav style={{ padding: "10px 8px", flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => navTo(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: page === n.id ? "#6366f122" : "none", color: page === n.id ? "#818cf8" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: page === n.id ? 600 : 400, marginBottom: 2, textAlign: "left", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && n.label}
            </button>
          ))}
        </nav>
        {!collapsed && (
          <div style={{ padding: "12px 14px", borderTop: "1px solid #1e293b" }}>
            <div style={{ background: "#6366f111", border: "1px solid #6366f133", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Active Thesis</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Deep Tech / AI & ML</div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ margin: "8px", background: "#1e293b", border: "none", color: "#64748b", borderRadius: 8, padding: 8, cursor: "pointer", fontSize: 13 }}>
          {collapsed ? "▶" : "◀"}
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 48, background: "#070c1a", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 500, textTransform: "capitalize", letterSpacing: "0.02em" }}>
            {selected ? (
              <><span style={{ color: "#334155" }}>Companies</span><span style={{ margin: "0 6px", color: "#1e293b" }}>›</span><span style={{ color: "#94a3b8" }}>{selected.name}</span></>
            ) : (
              <span style={{ color: "#94a3b8" }}>{page}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "#475569" }}><span style={{ color: "#f59e0b" }}>★</span> {savedCompanies.length} saved</div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>VC</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          {selected ? (
            <CompanyProfile company={selected} lists={lists} onAddToList={addToList} onBack={() => setSelected(null)} notes={notes} setNotes={setNotes} />
          ) : page === "companies" ? (
            <CompaniesPage onSelect={c => setSelected(c)} savedCompanies={savedCompanies} setSavedCompanies={setSavedCompanies} />
          ) : page === "lists" ? (
            <ListsPage lists={lists} setLists={setLists} />
          ) : (
            <SavedPage savedCompanies={savedCompanies} setSavedCompanies={setSavedCompanies} onSelect={c => { setSelected(c); setPage("companies"); }} />
          )}
        </div>
      </div>
    </div>
  );
}

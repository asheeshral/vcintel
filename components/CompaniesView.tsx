"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Company, MOCK_COMPANIES, STAGES, SECTORS, getCompanySlug } from "@/lib/store";
import { Avatar, StagePill, ScoreBadge, stageColor } from "@/components/UI";

export default function CompaniesView({ savedCompanies, setSavedCompanies }: {
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
                                <td style={{ padding: 0 }}>
                                    <Link href={`/companies/${getCompanySlug(c)}`} style={{ display: "block", padding: "12px 16px", textDecoration: "none" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Avatar name={c.name} size={32} />
                                            <div>
                                                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                                                <div style={{ color: "#475569", fontSize: 11 }}>{c.domain}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td style={{ padding: 0 }}>
                                    <Link href={`/companies/${getCompanySlug(c)}`} style={{ display: "block", padding: "12px 16px", color: "#94a3b8", fontSize: 12, textDecoration: "none" }}>{c.sector}</Link>
                                </td>
                                <td style={{ padding: 0 }}>
                                    <Link href={`/companies/${getCompanySlug(c)}`} style={{ display: "block", padding: "12px 16px", textDecoration: "none" }}><StagePill stage={c.stage} /></Link>
                                </td>
                                <td style={{ padding: 0 }}>
                                    <Link href={`/companies/${getCompanySlug(c)}`} style={{ display: "block", padding: "12px 16px", color: "#94a3b8", fontSize: 12, fontFamily: "monospace", textDecoration: "none" }}>{c.raised}</Link>
                                </td>
                                <td style={{ padding: 0 }}>
                                    <Link href={`/companies/${getCompanySlug(c)}`} style={{ display: "block", padding: "12px 16px", textDecoration: "none" }}><ScoreBadge score={c.score} /></Link>
                                </td>
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

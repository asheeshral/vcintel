"use client";

import React, { useState } from "react";
import EnrichmentPanel from "@/app/components/EnrichmentPanel";
import { Company, SIGNAL_ICONS } from "@/lib/store";
import { Avatar, StagePill, Tag, ScoreBadge } from "@/components/UI";

export default function CompanyProfile({ company, lists, savedCompanies, setSavedCompanies, onAddToList, onBack, notes, setNotes }: {
    company: Company;
    lists: { id: string; name: string; companies: Company[] }[];
    savedCompanies: Company[];
    setSavedCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
    onAddToList: (listId: string, company: Company) => void;
    onBack: () => void;
    notes: Record<string, string>;
    setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
    const [note, setNote] = useState(notes[company.id] || "");
    const [tab, setTab] = useState("overview");
    const [noteSaved, setNoteSaved] = useState(false);

    const isSaved = savedCompanies.some(c => c.id === company.id);
    const toggleSave = () => setSavedCompanies(p => isSaved ? p.filter(x => x.id !== company.id) : [...p, company]);

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
                    <button onClick={toggleSave}
                        style={{ background: isSaved ? "#f59e0b22" : "#1e293b", color: isSaved ? "#f59e0b" : "#94a3b8", border: `1px solid ${isSaved ? "#f59e0b" : "#334155"}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
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

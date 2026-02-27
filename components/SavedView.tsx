"use client";

import React from "react";
import Link from "next/link";
import { Company, getCompanySlug } from "@/lib/store";
import { Avatar, StagePill, ScoreBadge } from "@/components/UI";

export default function SavedView({ savedCompanies, setSavedCompanies }: { savedCompanies: Company[]; setSavedCompanies: React.Dispatch<React.SetStateAction<Company[]>> }) {
    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 26 }}>Saved</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{savedCompanies.length} companies bookmarked</p>
            </div>
            {savedCompanies.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: 60 }}><div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>No saved companies yet.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {savedCompanies.map(c => (
                    <div key={c.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1e293b44")} onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}>
                        <Link href={`/companies/${getCompanySlug(c)}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", textDecoration: "none" }}>
                            <Avatar name={c.name} size={36} />
                            <div>
                                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                                <div style={{ color: "#64748b", fontSize: 12 }}>{c.sector} · {c.hq}</div>
                            </div>
                        </Link>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 18 }}>
                            <ScoreBadge score={c.score} /><StagePill stage={c.stage} />
                            <button onClick={() => setSavedCompanies(p => p.filter(x => x.id !== c.id))} style={{ background: "none", border: "1px solid #334155", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#64748b", cursor: "pointer" }}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Company, getCompanySlug } from "@/lib/store";
import { Avatar, StagePill } from "@/components/UI";

export default function ListsView({ lists, setLists }: {
    lists: { id: string; name: string; companies: Company[] }[];
    setLists: React.Dispatch<React.SetStateAction<{ id: string; name: string; companies: Company[] }[]>>;
}) {
    const [newName, setNewName] = useState("");
    const [focusedListId, setFocusedListId] = useState<string | null>(null);

    const focusedList = focusedListId ? lists.find(l => l.id === focusedListId) : null;
    const itemsToShow = focusedList ? [focusedList] : lists;
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
                <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 26 }}>
                    {focusedList ? focusedList.name : "Lists"}
                </h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
                    {focusedList ? `${focusedList.companies.length} companies in this collection` : "Organise and export company collections"}
                </p>
                {focusedList && <button onClick={() => setFocusedListId(null)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, marginTop: 8, padding: 0 }}>← Back to all lists</button>}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && createList()} placeholder="New list name…"
                    style={{ flex: 1, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none" }} />
                <button onClick={createList} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create</button>
            </div>
            {lists.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: 60 }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>No lists yet.</div>}
            {itemsToShow.map(list => (
                <div key={list.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: list.companies.length ? "1px solid #1e293b" : "none" }}>
                        <div style={{ cursor: "pointer" }} onClick={() => setFocusedListId(list.id)}>
                            <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{list.name}</span>
                            <span style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>{list.companies.length} co.</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => exportList(list, "csv")} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>↓ CSV</button>
                            <button onClick={() => exportList(list, "json")} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>↓ JSON</button>
                            <button onClick={() => deleteList(list.id)} style={{ background: "#1e293b", border: "1px solid #334155", color: "#ef4444", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Delete</button>
                        </div>
                    </div>
                    {list.companies.map(c => (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1e293b44", cursor: "pointer" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#1e293b44")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <Link href={`/companies/${getCompanySlug(c)}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", textDecoration: "none" }}>
                                <Avatar name={c.name} size={28} />
                                <span style={{ color: "#e2e8f0", fontSize: 13 }}>{c.name}</span>
                                <StagePill stage={c.stage} />
                            </Link>
                            <button onClick={(e) => { e.stopPropagation(); removeFromList(list.id, c.id); }} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, padding: "0 20px" }}>✕</button>
                        </div>
                    ))}
                    {list.companies.length === 0 && <div style={{ padding: "12px 20px", color: "#475569", fontSize: 12 }}>Add companies from the Companies page.</div>}
                </div>
            ))}
        </div>
    );
}

"use client";

import React from "react";

export const scoreColor = (s: number) => s >= 90 ? "#22c55e" : s >= 75 ? "#f59e0b" : "#64748b";
export const stageColor = (s: string) => ({ "Pre-Seed": "#7c3aed", "Seed": "#2563eb", "Series A": "#0891b2", "Series B": "#059669", "Series C+": "#dc2626" }[s as any] || "#64748b");

export function ScoreBadge({ score }: { score: number }) {
    return <span style={{ display: "inline-flex", alignItems: "center", background: `${scoreColor(score)}22`, color: scoreColor(score), border: `1px solid ${scoreColor(score)}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{score}</span>;
}

export function StagePill({ stage }: { stage: string }) {
    return <span style={{ background: `${stageColor(stage)}18`, color: stageColor(stage), border: `1px solid ${stageColor(stage)}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{stage}</span>;
}

export function Tag({ label }: { label: string }) {
    return <span style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{label}</span>;
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
    return <div style={{ width: size, height: size, borderRadius: size / 3, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{name[0]}</div>;
}

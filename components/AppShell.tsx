"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalStorage, Company } from "@/lib/store";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [savedCompanies] = useLocalStorage<Company[]>("vc_saved", []);

    // Determine current page from path
    const page = pathname === "/" ? "companies" : pathname.split('/')[1];

    const NAV = [
        { id: "companies", icon: "🏢", label: "Companies", href: "/companies" },
        { id: "lists", icon: "📋", label: "Lists", href: "/lists" },
        { id: "saved", icon: "⭐", label: "Saved", href: "/saved" }
    ];

    return (
        <div style={{ display: "flex", height: "100vh", background: "#020817", overflow: "hidden" }}>
            <aside style={{ width: collapsed ? 60 : 210, flexShrink: 0, background: "#070c1a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden" }}>
                <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
                    {!collapsed && <div><div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>VCIntel</div><div style={{ color: "#818cf8", fontSize: 10, whiteSpace: "nowrap" }}>AI Scout</div></div>}
                </div>
                <nav style={{ padding: "10px 8px", flex: 1 }}>
                    {NAV.map(n => (
                        <Link key={n.id} href={n.href} style={{ textDecoration: 'none' }}>
                            <button
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: pathname.startsWith(n.href) || (n.href === '/companies' && pathname === '/') ? "#6366f122" : "none", color: pathname.startsWith(n.href) || (n.href === '/companies' && pathname === '/') ? "#818cf8" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: pathname.startsWith(n.href) || (n.href === '/companies' && pathname === '/') ? 600 : 400, marginBottom: 2, textAlign: "left", whiteSpace: "nowrap" }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                                {!collapsed && n.label}
                            </button>
                        </Link>
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
                        <span style={{ color: "#94a3b8" }}>{page}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "#475569" }}><span style={{ color: "#f59e0b" }}>★</span> {savedCompanies.length} saved</div>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>VC</div>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

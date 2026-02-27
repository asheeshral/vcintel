"use client";

import { useState, useEffect } from "react";

export const MOCK_COMPANIES = [
    { id: "1", name: "Cognify Labs", domain: "cognifylabs.ai", stage: "Seed", sector: "AI Infrastructure", hq: "San Francisco, CA", founded: 2022, employees: "11-50", raised: "$4.2M", score: 94, tags: ["LLM", "DevTools", "B2B"], website: "https://cognifylabs.ai", description: "Developer tooling layer for production LLM applications with built-in evals, caching, and observability.", signals: [{ date: "2024-01-15", type: "funding", text: "Raised $4.2M seed led by Sequoia" }, { date: "2024-02-01", type: "hiring", text: "5 new ML engineer roles posted" }, { date: "2024-02-20", type: "product", text: "Launched public beta" }] },
    { id: "2", name: "NeuralFlow", domain: "neuralflow.io", stage: "Series A", sector: "MLOps", hq: "New York, NY", founded: 2021, employees: "51-100", raised: "$18M", score: 88, tags: ["MLOps", "Enterprise", "Cloud"], website: "https://neuralflow.io", description: "End-to-end MLOps platform that helps data teams ship models 10x faster with automated pipelines.", signals: [{ date: "2024-01-08", type: "funding", text: "Series A $18M led by a16z" }, { date: "2024-01-25", type: "partnership", text: "AWS partnership announced" }] },
    { id: "3", name: "Synthos AI", domain: "synthos.ai", stage: "Pre-Seed", sector: "Synthetic Data", hq: "Austin, TX", founded: 2023, employees: "1-10", raised: "$1.1M", score: 82, tags: ["Synthetic Data", "Privacy", "FinTech"], website: "https://synthos.ai", description: "Generates high-fidelity synthetic datasets for AI training while preserving privacy guarantees.", signals: [{ date: "2024-02-10", type: "funding", text: "Pre-seed $1.1M from Y Combinator" }, { date: "2024-02-18", type: "product", text: "API v2 launch with 50+ data schemas" }] },
    { id: "4", name: "VectorDB Inc", domain: "vectordb.dev", stage: "Series B", sector: "AI Infrastructure", hq: "Seattle, WA", founded: 2020, employees: "101-250", raised: "$45M", score: 79, tags: ["Vector DB", "Search", "Open Source"], website: "https://vectordb.dev", description: "Open-source vector database optimized for billion-scale similarity search with sub-millisecond latency.", signals: [{ date: "2023-12-01", type: "funding", text: "Series B $45M" }, { date: "2024-01-10", type: "product", text: "10,000 GitHub stars milestone" }] },
    { id: "5", name: "PromptLayer", domain: "promptlayer.com", stage: "Seed", sector: "DevTools", hq: "Boston, MA", founded: 2022, employees: "11-50", raised: "$6.8M", score: 76, tags: ["Prompt Eng", "Observability", "SaaS"], website: "https://promptlayer.com", description: "Middleware for tracking, managing, and optimizing LLM prompts across models and providers.", signals: [{ date: "2024-01-20", type: "hiring", text: "CTO hire from OpenAI" }, { date: "2024-02-05", type: "product", text: "Launched prompt versioning" }] },
    { id: "6", name: "Meridian AI", domain: "meridian.ai", stage: "Series A", sector: "AI Safety", hq: "San Francisco, CA", founded: 2021, employees: "51-100", raised: "$22M", score: 91, tags: ["AI Safety", "Alignment", "Research"], website: "https://meridian.ai", description: "Applied AI safety tooling for enterprise model auditing, red-teaming, and compliance.", signals: [{ date: "2024-02-12", type: "funding", text: "Series A $22M" }, { date: "2024-02-25", type: "press", text: "Featured in MIT Tech Review" }] },
    { id: "7", name: "Refract Bio", domain: "refractbio.com", stage: "Seed", sector: "BioAI", hq: "Cambridge, MA", founded: 2023, employees: "1-10", raised: "$3.5M", score: 85, tags: ["BioAI", "Drug Discovery", "Deep Tech"], website: "https://refractbio.com", description: "Applying protein language models to accelerate small molecule drug discovery pipelines.", signals: [{ date: "2024-01-30", type: "funding", text: "$3.5M seed from Flagship" }, { date: "2024-02-15", type: "hiring", text: "Head of Research hire" }] },
    { id: "8", name: "Quanta Edge", domain: "quantaedge.io", stage: "Pre-Seed", sector: "Quantum ML", hq: "Chicago, IL", founded: 2023, employees: "1-10", raised: "$800K", score: 71, tags: ["Quantum", "ML", "Deep Tech"], website: "https://quantaedge.io", description: "Hybrid quantum-classical ML algorithms for optimization problems in logistics and supply chain.", signals: [{ date: "2024-02-01", type: "funding", text: "$800K pre-seed" }] },
];

export const getCompanySlug = (c: { name: string; id: string }) =>
    c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export type Company = (typeof MOCK_COMPANIES)[0];

export const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
export const SECTORS = ["AI Infrastructure", "MLOps", "Synthetic Data", "DevTools", "AI Safety", "BioAI", "Quantum ML"];
export const SIGNAL_ICONS: Record<string, string> = { funding: "💰", hiring: "👥", product: "🚀", partnership: "🤝", press: "📰" };

export function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [val, setVal] = useState<T>(initial);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const s = localStorage.getItem(key);
            if (s) setVal(JSON.parse(s));
        } catch { }

        const onSync = () => {
            try {
                const s = localStorage.getItem(key);
                if (s) setVal(JSON.parse(s));
            } catch { }
        };

        window.addEventListener("storage_sync", onSync);
        window.addEventListener("storage", onSync);
        return () => {
            window.removeEventListener("storage_sync", onSync);
            window.removeEventListener("storage", onSync);
        };
    }, [key]);

    useEffect(() => {
        if (!mounted) return;
        try {
            const current = localStorage.getItem(key);
            const next = JSON.stringify(val);
            if (current !== next) {
                localStorage.setItem(key, next);
                window.dispatchEvent(new Event("storage_sync"));
            }
        } catch { }
    }, [key, val, mounted]);

    return [val, setVal];
}

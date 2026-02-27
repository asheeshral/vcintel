"use client";

import React, { useState } from "react";
import { useLocalStorage, Company, MOCK_COMPANIES } from "@/lib/store";
import CompanyProfile from "@/components/CompanyProfile";
import { notFound, useParams, useRouter } from "next/navigation";

export default function CompanyPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    // Find company by slug (id or name match)
    const company = MOCK_COMPANIES.find(c =>
        c.id === slug ||
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );

    const [lists, setLists] = useLocalStorage<{ id: string; name: string; companies: Company[] }[]>("vc_lists", []);
    const [savedCompanies, setSavedCompanies] = useLocalStorage<Company[]>("vc_saved", []);
    const [notes, setNotes] = useLocalStorage<Record<string, string>>("vc_notes", {});

    if (!company) {
        return notFound();
    }

    function addToList(listId: string, company: Company) {
        setLists(p => p.map(l => l.id === listId && !l.companies.find(c => c.id === company.id) ? { ...l, companies: [...l.companies, company] } : l));
    }

    return (
        <CompanyProfile
            company={company}
            lists={lists}
            savedCompanies={savedCompanies}
            setSavedCompanies={setSavedCompanies}
            onAddToList={addToList}
            onBack={() => router.back()}
            notes={notes}
            setNotes={setNotes}
        />
    );
}

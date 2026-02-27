"use client";

import React from "react";
import { useLocalStorage, Company } from "@/lib/store";
import CompaniesView from "@/components/CompaniesView";
import CompanyProfile from "@/components/CompanyProfile";

export default function Page() {
    const [lists, setLists] = useLocalStorage<{ id: string; name: string; companies: Company[] }[]>("vc_lists", []);
    const [savedCompanies, setSavedCompanies] = useLocalStorage<Company[]>("vc_saved", []);

    return (
        <CompaniesView
            savedCompanies={savedCompanies}
            setSavedCompanies={setSavedCompanies}
        />
    );
}

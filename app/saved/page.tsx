"use client";

import React from "react";
import { useLocalStorage, Company } from "@/lib/store";
import SavedView from "@/components/SavedView";
import CompanyProfile from "@/components/CompanyProfile";

export default function Page() {
    const [savedCompanies, setSavedCompanies] = useLocalStorage<Company[]>("vc_saved", []);

    return (
        <SavedView
            savedCompanies={savedCompanies}
            setSavedCompanies={setSavedCompanies}
        />
    );
}

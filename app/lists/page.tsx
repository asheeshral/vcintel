"use client";

import React from "react";
import { useLocalStorage, Company } from "@/lib/store";
import ListsView from "@/components/ListsView";
import CompanyProfile from "@/components/CompanyProfile";

export default function Page() {
    const [lists, setLists] = useLocalStorage<{ id: string; name: string; companies: Company[] }[]>("vc_lists", []);

    return (
        <ListsView lists={lists} setLists={setLists} />
    );
}

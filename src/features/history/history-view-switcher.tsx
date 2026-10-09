"use client";

import { useState } from "react";
import { EntryListView } from "@/features/history/entry-list-view";
import { EntryCalendarView } from "@/features/history/entry-calendar-view";
import { ViewToggle, type View } from "@/features/history/view-toggle";
import type { getEntries } from "@/entities/entry/server";

type Entry = Awaited<ReturnType<typeof getEntries>>[number];

export function HistoryViewSwitcher({ entries, month }: { entries: Entry[]; month: Date }) {
    const [view, setView] = useState<View>("list");

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <ViewToggle value={view} onChange={setView} />

            {view === "list" ? (
                <EntryListView entries={entries} />
            ) : (
                <EntryCalendarView entries={entries} month={month} />
            )}
        </div>
    );
}

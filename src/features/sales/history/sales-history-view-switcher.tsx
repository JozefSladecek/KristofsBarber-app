"use client";

import { useState } from "react";
import { ViewToggle, type View } from "@/features/history/view-toggle";
import { SalesHistoryList } from "./sales-history-list";
import { SalesCalendarView } from "./sales-calendar-view";
import { EmptyMonth } from "./empty-month";
import type { getSales } from "@/entities/sale/server";

type Sale = Awaited<ReturnType<typeof getSales>>[number];

export function SalesHistoryViewSwitcher({ sales, month }: { sales: Sale[]; month: Date }) {
    const [view, setView] = useState<View>("list");

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <ViewToggle value={view} onChange={setView} />

            {sales.length === 0 ? (
                <EmptyMonth month={month} />
            ) : view === "list" ? (
                <SalesHistoryList sales={sales} />
            ) : (
                <SalesCalendarView sales={sales} month={month} />
            )}
        </div>
    );
}

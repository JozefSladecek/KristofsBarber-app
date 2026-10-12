import { getEntries } from "@/entities/entry/server";
import { summarizeEntries, applyPaidOut } from "@/entities/entry";
import { getPayoutAmount } from "@/entities/overview/server";
import {MonthSelector} from "@/features/history/month-selector";
import { HistoryViewSwitcher } from "@/features/history/history-view-switcher";
import { MonthSummary } from "@/features/history/month-summary";

export async function HistoryList({ userId, month }: { userId: string; month?: Date }) {
    const entries = await getEntries(userId, month);
    const currentMonth = month ?? new Date();

    const rawSummary = summarizeEntries(entries); // for 1 employee, for the month
    const paidOut = await getPayoutAmount(userId, month);
    const monthSummary = applyPaidOut(rawSummary, paidOut);

    return (
        <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <MonthSelector currentMonth={currentMonth} />
            <p className="text-muted-foreground shrink-0 text-center text-xs">
                Klepni na deň pre úpravu záznamu
            </p>

            <HistoryViewSwitcher entries={entries} month={currentMonth} />

            <MonthSummary summary={monthSummary} />
        </div>
    );
}

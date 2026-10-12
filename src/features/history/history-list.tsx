import { getEntries } from "@/entities/entry/server";
import { getPayoutAmount } from "@/entities/overview/server";
import {MonthSelector} from "@/features/history/month-selector";
import { HistoryViewSwitcher } from "@/features/history/history-view-switcher";
import { MonthSummary } from "@/features/history/month-summary";

export async function HistoryList({ userId, month }: { userId: string; month?: Date }) {
    const entries = await getEntries(userId, month);
    const currentMonth = month ?? new Date();

    // todo make utility for this
    const rawSummary = entries.reduce(
        (acc, entry) => ({
            clients: acc.clients + entry.clients,
            cash: acc.cash + entry.cash,
            card: acc.card + entry.card,
            total: acc.total + entry.cash + entry.card,
            toReturn: acc.toReturn + (entry.envelopeCash ?? entry.cash) - entry.cash,
        }),
        { clients: 0, cash: 0, card: 0, total: 0, toReturn: 0 }
    );

    const paidOut = await getPayoutAmount(userId, month);
    const monthSummary = { ...rawSummary, toReturn: rawSummary.toReturn - paidOut };

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

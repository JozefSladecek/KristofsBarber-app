import { auth } from "@/lib/auth";
import { getSales } from "@/entities/sale/server";
import { summarizeSales } from "@/entities/sale";
import { MonthSelector } from "@/features/history/month-selector";
import { SalesHistoryViewSwitcher } from "./sales-history-view-switcher";
import { SalesMonthSummary } from "./sales-month-summary";

export async function SalesHistoryPage({ month }: { month?: string }) {
    const session = await auth();
    const currentMonth = month ? new Date(`${month}-01`) : new Date();

    const sales = await getSales(session!.user!.id, currentMonth);
    const summary = summarizeSales(sales);

    return (
        <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <MonthSelector currentMonth={currentMonth} />
            <SalesHistoryViewSwitcher sales={sales} month={currentMonth} />
            <SalesMonthSummary summary={summary} />
        </div>
    );
}

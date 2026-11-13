import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireAdminOrOwner } from "@/lib/auth";
import { getEmployeeById } from "@/entities/overview/server";
import { getSales } from "@/entities/sale/server";
import { summarizeSales, calculateCommission } from "@/entities/sale";
import { MonthSelector } from "@/features/history/month-selector";
import { SalesHistoryViewSwitcher } from "../history/sales-history-view-switcher";
import { SalesMonthSummary } from "../history/sales-month-summary";
import { EmptyMonth } from "../history/empty-month";

export async function EmployeeHistoryPage({ userId, month }: { userId: string; month?: string }) {
    const { error } = await requireAdminOrOwner();
    if (error) {
        notFound();
    }

    const employee = await getEmployeeById(userId);
    if (!employee) {
        notFound();
    }

    const currentMonth = month ? new Date(`${month}-01`) : new Date();
    const sales = await getSales(userId, currentMonth);
    const commission = employee.role === "OWNER" ? undefined : calculateCommission(sales);

    return (
        <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-2">
                <Link
                    href="/sales/overview"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Prehľad
                </Link>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    História · <b className="text-foreground">{employee.name}</b>
                </span>
            </div>

            <MonthSelector currentMonth={currentMonth} />

            {sales.length === 0 ? (
                <EmptyMonth month={currentMonth} />
            ) : (
                <>
                    <SalesHistoryViewSwitcher sales={sales} month={currentMonth} />
                    <SalesMonthSummary summary={summarizeSales(sales)} commission={commission} />
                </>
            )}
        </div>
    );
}

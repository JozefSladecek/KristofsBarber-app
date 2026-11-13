import { notFound } from "next/navigation";
import { requireAdminOrOwner } from "@/lib/auth";
import { getAllSales } from "@/entities/sale/server";
import { summarizeOverview, summarizeByEmployee, summarizeByItem } from "@/entities/sale";
import { MonthSelector } from "@/features/history/month-selector";
import { SalesOverviewSummary } from "./sales-overview-summary";
import { SalesByEmployeeList } from "./sales-by-employee-list";
import { SalesByItemList } from "./sales-by-item-list";
import { EmptyOverview } from "./empty-overview";

export async function SalesOverviewPage({ month }: { month?: string }) {
    const { error } = await requireAdminOrOwner();
    if (error) {
        notFound();
    }

    const currentMonth = month ? new Date(`${month}-01`) : new Date();
    const sales = await getAllSales(currentMonth);

    return (
        <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <MonthSelector currentMonth={currentMonth} />
            {sales.length === 0 ? (
                <EmptyOverview month={currentMonth} />
            ) : (
                <>
                    <SalesOverviewSummary summary={summarizeOverview(sales).totalSummary} />
                    <SalesByEmployeeList employees={summarizeByEmployee(sales)} />
                    <SalesByItemList categories={summarizeByItem(sales)} />
                </>
            )}
        </div>
    );
}

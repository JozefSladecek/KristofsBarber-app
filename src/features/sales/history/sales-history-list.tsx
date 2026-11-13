import Link from "next/link";
import { ChevronDown, ChevronRight, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import type { getSales } from "@/entities/sale/server";
import { groupSalesByDay, saleTotal } from "@/entities/sale";

const PAYMENT_METHOD_LABELS = { CASH: "Hotovosť", CARD: "Karta" } as const;

type Sale = Awaited<ReturnType<typeof getSales>>[number];

export function SalesHistoryList({ sales }: { sales: Sale[] }) {
    const days = groupSalesByDay(sales);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
                {days.map((day, index) => {
                    const weekday = format(day.date, "EEEEEE", { locale: sk });
                    const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);

                    return (
                        <details
                            key={day.date.toISOString()}
                            className="border-border [&+details]:border-t"
                            open={index === 0}
                        >
                            <summary className="flex min-h-13 cursor-pointer list-none items-center gap-3 bg-secondary px-3 tabular-nums hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]">
                                <span className="w-18 shrink-0">
                                    <b className="font-semibold">{weekdayLabel}</b> {format(day.date, "dd.MM.")}
                                </span>
                                <span className="flex-1 text-muted-foreground">
                                    {day.sales.length} {day.sales.length === 1 ? "nákup" : "nákupy"}
                                </span>
                                <span className="text-base font-bold text-primary">
                                    {day.total.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
                                </span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </summary>
                            <ul className="divide-y divide-border border-t border-border bg-card">
                                {day.sales.map((sale) => {
                                    const quantity = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                                    const extraCount = sale.items.length - 1;

                                    return (
                                        <li key={sale.id}>
                                            <Link
                                                href={`/sales/${sale.id}`}
                                                aria-label="Upraviť nákup"
                                                className="flex min-h-14 items-center gap-3 py-2.5 pr-3 pl-6 hover:bg-muted"
                                            >
                                                <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                                                    <span className="truncate font-medium">
                                                        {sale.items[0].productName}
                                                        {extraCount > 0 && (
                                                            <span className="font-normal text-muted-foreground">
                                                                {" "}
                                                                + {extraCount}{" "}
                                                                {extraCount === 1 ? "ďalšia" : "ďalšie"}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground tabular-nums">
                                                        {quantity} ks · {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
                                                    </span>
                                                    {sale.note && (
                                                        <span className="flex items-center gap-1 text-xs italic text-muted-foreground">
                                                            <StickyNote className="h-3 w-3" />
                                                            {sale.note}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="shrink-0 text-base font-semibold tabular-nums">
                                                    {saleTotal(sale).toLocaleString("sk-SK", {
                                                        minimumFractionDigits: 2,
                                                    })}{" "}
                                                    €
                                                </span>
                                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </details>
                    );
                })}
            </div>
        </div>
    );
}

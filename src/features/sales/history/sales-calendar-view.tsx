import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { sk } from "date-fns/locale";
import type { getSales } from "@/entities/sale/server";

type Sale = Awaited<ReturnType<typeof getSales>>[number];

const WEEKDAY_LABELS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const CELL_CLASS = "relative flex h-full items-center justify-center rounded-md text-sm";

export function SalesCalendarView({ sales, month }: { sales: Sale[]; month: Date }) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const leadingBlanks = (start.getDay() + 6) % 7;

    return (
        <div className="flex h-full min-h-0 flex-col gap-2">
            <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-[auto] auto-rows-[1fr] gap-1">
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="text-center text-xs font-normal text-muted-foreground">
                        {label}
                    </div>
                ))}

                {Array.from({ length: leadingBlanks }).map((_, i) => (
                    <div key={`blank-${i}`} />
                ))}

                {days.map((day) => {
                    const hasSale = sales.some((sale) => isSameDay(sale.date, day));

                    return (
                        <div
                            key={day.toISOString()}
                            className={
                                hasSale
                                    ? `${CELL_CLASS} bg-primary/40 font-semibold text-foreground`
                                    : `${CELL_CLASS} text-muted-foreground`
                            }
                        >
                            {format(day, "d", { locale: sk })}
                        </div>
                    );
                })}
            </div>

            <div className="flex shrink-0 items-center justify-center gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-primary/40" />
                    <span>Deň s nákupom</span>
                </div>
            </div>
        </div>
    );
}

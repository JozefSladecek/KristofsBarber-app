import Link from "next/link";
import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { sk } from "date-fns/locale";
import type { getEntries } from "@/entities/entry/server";

type Entry = Awaited<ReturnType<typeof getEntries>>[number];

const WEEKDAY_LABELS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const CELL_CLASS = "flex h-full items-center justify-center rounded-md text-sm";

export function EntryCalendarView({ entries, month }: { entries: Entry[]; month: Date }) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    // Calculate the number of empty cells before the first day of the month
    const leadingBlanks = (start.getDay() + 6) % 7;

    return (
        <div className="grid h-full min-h-0 grid-cols-7 grid-rows-[auto] auto-rows-[1fr] gap-1">
            {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="text-muted-foreground text-center text-xs font-normal">
                    {label}
                </div>
            ))}

            {Array.from({ length: leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} />
            ))}

            {days.map((day) => {
                const entry = entries.find((entry) => isSameDay(entry.date, day));

                if (entry) {
                    return (
                        <Link
                            key={day.toISOString()}
                            href={`/history/${entry.id}`}
                            className={`${CELL_CLASS} bg-primary/20 text-foreground hover:bg-primary/30 font-semibold transition-colors`}
                        >
                            {format(day, "d", { locale: sk })}
                        </Link>
                    );
                }

                return (
                    <div key={day.toISOString()} className={`${CELL_CLASS} text-muted-foreground`}>
                        {format(day, "d", { locale: sk })}
                    </div>
                );
            })}
        </div>
    );
}

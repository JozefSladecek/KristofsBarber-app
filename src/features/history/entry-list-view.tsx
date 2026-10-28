import Link from "next/link";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { StickyNote } from "lucide-react";
import type { getEntries } from "@/entities/entry/server";

type Entry = Awaited<ReturnType<typeof getEntries>>[number];

export function EntryListView({ entries }: { entries: Entry[] }) {
    if (entries.length === 0) {
        return (
            <p className="text-muted-foreground py-4 text-center">
                Zatiaľ žiadne záznamy
            </p>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="bg-card border-border rounded-lg border">
                {entries.map((entry, index) => {
                    const total = entry.cash + entry.card;
                    const weekday = format(entry.date, "EEEEEE", { locale: sk });
                    const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);

                    return (
                        <Link
                            key={entry.id}
                            href={`/history/${entry.id}`}
                            className={`hover:bg-secondary flex shrink-0 items-center justify-between px-4 py-3 transition-colors ${
                                index !== entries.length - 1 ? "border-border border-b" : ""
                            }`}
                        >
                            <div className="flex items-baseline gap-3">
                                <span className="text-foreground shrink-0 font-semibold">
                                    {weekdayLabel} {format(entry.date, "dd.MM.", { locale: sk })}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                    {entry.clients} klientov · hot {entry.cash}€ · karta {entry.card}€
                                </span>
                                {entry.note && (
                                    <StickyNote className="text-primary -ml-1 h-4 w-4 shrink-0 self-center" />
                                )}
                            </div>
                            <span className="text-primary text-lg font-bold">
                                {total.toLocaleString("sk-SK", { maximumFractionDigits: 2 })} €
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

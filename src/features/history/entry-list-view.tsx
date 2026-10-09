import Link from "next/link";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
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
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {entries.map((entry) => {
                const total = entry.cash + entry.card;
                return (
                    <Link
                        key={entry.id}
                        href={`/history/${entry.id}`}
                        className="bg-card border-border hover:border-primary flex shrink-0 items-center justify-between rounded-lg border px-4 py-3 transition-colors"
                    >
                        <div className="flex items-baseline gap-3">
                            <span className="text-foreground w-12 shrink-0 font-semibold">
                                {format(entry.date, "dd.MM.", { locale: sk })}
                            </span>
                            <span className="text-muted-foreground text-sm">
                                {entry.clients} klientov · hot {entry.cash}€ · karta {entry.card}€
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-primary font-bold">{total}€</span>
                            <ChevronRight className="text-muted-foreground h-4 w-4" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

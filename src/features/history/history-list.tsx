import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { getEntries } from "@/entities/entry/queries";

export async function HistoryList() {
    const entries = await getEntries("1");

    // Mock data
    const monthSummary = entries.reduce(
        (acc, entry) => ({
            clients: acc.clients + entry.clients,
            cash: acc.cash + entry.cash,
            card: acc.card + entry.card,
            total: acc.total + entry.cash + entry.card,
        }),
        { clients: 0, cash: 0, card: 0, total: 0 }
    );

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-muted-foreground text-center text-xs">
                Klepni na deň pre úpravu záznamu
            </p>

            <div className="flex flex-col">
                {entries.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center">
                        Zatiaľ žiadne záznamy
                    </p>
                )}

                {entries.map((entry, index) => {
                    const total = entry.cash + entry.card;
                    return (
                        <div
                            key={entry.id}
                            className={
                                index !== entries.length - 1
                                    ? "border-border flex items-center justify-between border-b py-3"
                                    : "flex items-center justify-between py-3"
                            }
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
                        </div>
                    );
                })}
            </div>

            <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
        <span className="text-primary text-xs font-semibold uppercase tracking-wide">
          Mesačný súčet
        </span>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Klienti spolu</span>
                    <span className="text-foreground">{monthSummary.clients}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hotovosť spolu</span>
                    <span className="text-foreground">{monthSummary.cash} €</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kartou spolu</span>
                    <span className="text-foreground">{monthSummary.card} €</span>
                </div>

                <div className="border-border flex items-center justify-between border-t pt-3">
                    <span className="text-primary text-lg font-bold">Spolu</span>
                    <span className="text-primary text-xl font-bold">{monthSummary.total} €</span>
                </div>
            </div>

            <p className="text-muted-foreground text-center text-xs">
                Klik na deň = úprava záznamu (nie prioritné teraz)
            </p>
        </div>
    );
}
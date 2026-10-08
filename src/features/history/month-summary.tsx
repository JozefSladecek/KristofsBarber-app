type Summary = {
    clients: number;
    cash: number;
    card: number;
    total: number;
};

export function MonthSummary({ summary }: { summary: Summary }) {
    return (
        <div className="border-border bg-card flex shrink-0 flex-col gap-3 rounded-lg border p-4">
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                Mesačný súčet
            </span>

            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Klienti spolu</span>
                <span className="text-foreground">{summary.clients}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hotovosť spolu</span>
                <span className="text-foreground">{summary.cash} €</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Kartou spolu</span>
                <span className="text-foreground">{summary.card} €</span>
            </div>

            <div className="border-border flex items-center justify-between border-t pt-3">
                <span className="text-primary text-lg font-bold">Spolu</span>
                <span className="text-primary text-xl font-bold">{summary.total} €</span>
            </div>
        </div>
    );
}

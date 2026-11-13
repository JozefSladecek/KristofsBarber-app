type Summary = { count: number; cash: number; card: number; total: number };

function formatEur(value: number) {
    return `${value.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;
}

export function SalesMonthSummary({ summary, commission }: { summary: Summary; commission?: number }) {
    return (
        <div className="flex shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Mesačný súčet · {summary.count} {summary.count === 1 ? "nákup" : "nákupov"}
            </span>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between tabular-nums">
                    <span className="text-muted-foreground">Hotovosť</span>
                    <span className="text-foreground">{formatEur(summary.cash)}</span>
                </div>
                <div className="flex items-center justify-between tabular-nums">
                    <span className="text-muted-foreground">Karta</span>
                    <span className="text-foreground">{formatEur(summary.card)}</span>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 tabular-nums">
                <span className="text-lg font-bold text-primary">Spolu</span>
                <span className="text-xl font-bold text-primary">{formatEur(summary.total)}</span>
            </div>

            {commission !== undefined && (
                <div className="flex items-center justify-between text-[13px] tabular-nums">
                    <span className="text-muted-foreground">Provízia · 15 % z produktov</span>
                    <span className="font-semibold text-foreground">{formatEur(commission)}</span>
                </div>
            )}
        </div>
    );
}

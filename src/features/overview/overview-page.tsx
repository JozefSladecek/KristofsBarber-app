import { getOverviewData } from "@/entities/entry/overview-queries";

export async function OverviewPage() {
    const { totalSummary, byEmployee } = await getOverviewData();

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                    Súčet za všetkých
                </span>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Klienti spolu</span>
                    <span className="text-foreground">{totalSummary.clients}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hotovosť spolu</span>
                    <span className="text-foreground">{totalSummary.cash} €</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kartou spolu</span>
                    <span className="text-foreground">{totalSummary.card} €</span>
                </div>

                <div className="border-border flex items-center justify-between border-t pt-3">
                    <span className="text-primary text-lg font-bold">Spolu (prevádzka)</span>
                    <span className="text-primary text-xl font-bold">{totalSummary.total} €</span>
                </div>
            </div>

            <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                    Podľa zamestnanca
                </span>

                {byEmployee.length === 0 && (
                    <p className="text-muted-foreground text-center text-sm">Zatiaľ žiadne dáta</p>
                )}

                {byEmployee.map((employee) => (
                    <div key={employee.userId} className="flex items-center justify-between">
                        <span className="text-foreground">{employee.name}</span>
                        <span className="text-primary font-semibold">{employee.total} €</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
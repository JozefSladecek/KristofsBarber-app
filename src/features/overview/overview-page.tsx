import { getOverviewData, getAllEmployees } from "@/entities/overview/queries";
import { HistoryList } from "@/features/history/history-list";
import { EmployeeSelect } from "./employee-select";

export async function OverviewPage({ selectedUserId, month }: { selectedUserId?: string; month?: string }) {
    const currentMonth = month ? new Date(`${month}-01`) : new Date();
    const employees = await getAllEmployees();

    if (selectedUserId) {
        return (
            <div className="flex h-full min-h-0 flex-col">
                <div className="p-4">
                    <EmployeeSelect employees={employees} selectedUserId={selectedUserId} />
                </div>
                <HistoryList userId={selectedUserId} month={currentMonth} />
            </div>
        );
    }

    const { totalSummary, byEmployee } = await getOverviewData();

    return (
        <div className="flex flex-col gap-4 p-4">
            <EmployeeSelect employees={employees} selectedUserId={selectedUserId} />

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

                {byEmployee.map((employee, index) => (
                    <div
                        key={employee.userId}
                        className={
                            index !== byEmployee.length - 1
                                ? "border-border flex items-center justify-between border-b pb-3"
                                : "flex items-center justify-between"
                        }
                    >
                        <span className="text-foreground">{employee.name}</span>
                        <span className="text-primary font-semibold">{employee.total} €</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
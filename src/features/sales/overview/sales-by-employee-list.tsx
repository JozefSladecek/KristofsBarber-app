import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Employee = {
    userId: string;
    name: string;
    isOwner: boolean;
    count: number;
    quantity: number;
    total: number;
    commission: number | null;
};

function formatEur(value: number) {
    return `${value.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;
}

export function SalesByEmployeeList({ employees }: { employees: Employee[] }) {
    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Podľa zamestnanca
            </h3>
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {employees.map((employee) => (
                    <li key={employee.userId}>
                        <Link
                            href={`/sales/overview/${employee.userId}`}
                            className="flex min-h-14 items-center gap-3 px-3 py-2 hover:bg-muted"
                        >
                            <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                                <span className="text-base font-semibold">{employee.name}</span>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {employee.count} {employee.count === 1 ? "nákup" : "nákupov"} · {employee.quantity} ks
                                </span>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {employee.isOwner ? (
                                        "Majiteľ, bez provízie"
                                    ) : (
                                        <>
                                            Provízia <b className="text-foreground">{formatEur(employee.commission!)}</b>
                                        </>
                                    )}
                                </span>
                            </span>
                            <span className="shrink-0 text-base font-bold tabular-nums text-primary">
                                {formatEur(employee.total)}
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

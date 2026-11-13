import { monthLocative } from "@/lib/date-utils";

export function EmptyOverview({ month }: { month: Date }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
            <p>{monthLocative(month)} žiadny predaj.</p>
        </div>
    );
}

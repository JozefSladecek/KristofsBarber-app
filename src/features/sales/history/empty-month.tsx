import Link from "next/link";
import { isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { monthLocative } from "@/lib/date-utils";

export function EmptyMonth({ month }: { month: Date }) {
    const isCurrentMonth = isSameMonth(month, new Date());
    const prefix = monthLocative(month);

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
            <p>{prefix} {isCurrentMonth ? "zatiaľ žiadny nákup." : "žiadny nákup."}</p>
            {isCurrentMonth && (
                <Button variant="outline" size="lg" render={<Link href="/sales" />}>
                    Zapísať nákup
                </Button>
            )}
        </div>
    );
}

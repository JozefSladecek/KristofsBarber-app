import Link from "next/link";
import { isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";

// locative case ("v auguste", "vo februári") - Slovak month names don't follow a regular pattern here
const MONTH_LOCATIVE = [
    "V januári",
    "Vo februári",
    "V marci",
    "V apríli",
    "V máji",
    "V júni",
    "V júli",
    "V auguste",
    "V septembri",
    "V októbri",
    "V novembri",
    "V decembri",
];

export function EmptyMonth({ month }: { month: Date }) {
    const isCurrentMonth = isSameMonth(month, new Date());
    const prefix = MONTH_LOCATIVE[month.getMonth()];

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

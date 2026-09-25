"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format, addMonths, subMonths } from "date-fns";
import { sk } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function MonthSelector({ currentMonth }: { currentMonth: Date }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function navigateToMonth(date: Date) {
        const params = new URLSearchParams(searchParams);
        params.set("month", format(date, "yyyy-MM"));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigateToMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover>
                <PopoverTrigger className="text-foreground text-sm font-semibold capitalize hover:text-primary">
                    {format(currentMonth, "LLLL yyyy", { locale: sk })}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={currentMonth}
                        onSelect={(date) => date && navigateToMonth(date)}
                        className="rounded-lg border-border"
                    />
                </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={() => navigateToMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
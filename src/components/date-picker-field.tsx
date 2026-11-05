"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DatePickerFieldProps = {
    label?: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
};

export function DatePickerField({ label = "Dátum", value, onChange }: DatePickerFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">{label}</Label>
            <Popover>
                <PopoverTrigger className="bg-card border-border flex h-10 w-full items-center rounded-md border px-3 text-left text-lg font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {value ? format(value, "EEEE, dd.MM.yyyy", { locale: sk }) : "Vyber dátum"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={value} onSelect={onChange} className="rounded-lg border-border" />
                </PopoverContent>
            </Popover>
        </div>
    );
}

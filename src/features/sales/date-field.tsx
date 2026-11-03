"use client";

import { DatePickerField } from "@/components/date-picker-field";
import { useSale } from "./sale-context";

export function DateField() {
    const { date, setDate } = useSale();

    return <DatePickerField value={date} onChange={setDate} />;
}

"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSale } from "./sale-context";

export function NoteField() {
    const { note, setNote } = useSale();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="note" className="text-muted-foreground text-xs uppercase tracking-wide">
                Poznámka
            </Label>
            <Textarea
                id="note"
                placeholder="Nepovinné"
                className="bg-card border-border"
                value={note}
                onChange={(event) => setNote(event.target.value)}
            />
        </div>
    );
}

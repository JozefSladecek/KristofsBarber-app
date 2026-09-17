"use client";

import { useState } from "react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {toast} from "sonner";
import { saveEntry } from "@/server/entry/actions";

export function EntryForm() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [clients, setClients] = useState("");
    const [cash, setCash] = useState("");
    const [card, setCard] = useState("");
    const [note, setNote] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const total = (parseFloat(cash) || 0) + (parseFloat(card) || 0);

    async function handleSave() {
        if (!date) return;

        setIsSaving(true);
        try {
            await saveEntry({
                date,
                clients: Number(clients),
                cash: Number(cash),
                card: Number(card),
                note: note || null,
                userId: "1", // todo fix this later, get user id from session
            });

            toast.success("Deň bol úspešne uložený");
        } catch (error) {
            toast.error("Nepodarilo sa uložiť deň, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card className="border-border bg-transparent shadow-none">
            <CardContent className="flex flex-col gap-6 px-4">
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        Dátum
                    </Label>
                    <Popover>
                        <PopoverTrigger className="bg-card border-border flex h-10 w-full items-center rounded-md border px-3 text-left text-lg font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {date ? format(date, "EEEE, dd.MM.yyyy", { locale: sk }) : "Vyber dátum"}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-lg border-border"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="clients" className="text-muted-foreground text-xs uppercase tracking-wide">
                        Počet klientov
                    </Label>
                    <Input
                        id="clients"
                        type="number"
                        placeholder="0"
                        value={clients}
                        onChange={(e) => setClients(e.target.value)}
                        className="bg-card border-border text-lg"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="cash" className="text-muted-foreground text-xs uppercase tracking-wide">
                        Hotovosť
                    </Label>
                    <div className="bg-card border-border flex items-center rounded-lg border px-3">
                        <Input
                            id="cash"
                            type="number"
                            placeholder="0"
                            value={cash}
                            onChange={(e) => setCash(e.target.value)}
                            className="border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
                        />
                        <span className="text-primary font-semibold">€</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="card" className="text-muted-foreground text-xs uppercase tracking-wide">
                        Karta
                    </Label>
                    <div className="bg-card border-border flex items-center rounded-lg border px-3">
                        <Input
                            id="card"
                            type="number"
                            placeholder="0"
                            value={card}
                            onChange={(e) => setCard(e.target.value)}
                            className="border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
                        />
                        <span className="text-primary font-semibold">€</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="note" className="text-muted-foreground text-xs uppercase tracking-wide">
                        Poznámka
                    </Label>
                    <Textarea
                        id="note"
                        placeholder="Nepovinné"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="bg-card border-border"
                    />
                </div>

                <div className="border-accent bg-secondary flex items-baseline justify-between rounded-lg border px-4 py-3">
                    <span className="text-muted-foreground text-xs uppercase tracking-wide">Spolu</span>
                    <span className="text-primary text-2xl font-bold">{total} €</span>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full text-base font-bold tracking-wide uppercase"
                >
                    {isSaving ? "Ukladám..." : "Uložiť deň"}
                </Button>

            </CardContent>
        </Card>
    );
}
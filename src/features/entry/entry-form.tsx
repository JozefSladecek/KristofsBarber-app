"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { CalendarIcon, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { saveEntry, updateEntry } from "@/entities/entry/actions";

type EntryFormProps = {
    userId: string;
    entryId?: string;
    initialData?: {
        date: Date;
        clients: number;
        cash: number;
        card: number;
        note: string | null;
    };
    isAdmin: boolean;
};

export function EntryForm({ userId, entryId, isAdmin, initialData }: EntryFormProps) {
    const router = useRouter();
    const isEditMode = !!entryId;

    const [date, setDate] = useState<Date | undefined>(initialData?.date ?? new Date());
    const [clients, setClients] = useState(initialData?.clients?.toString() ?? "");
    const [cash, setCash] = useState(initialData?.cash?.toString() ?? "");
    const [card, setCard] = useState(initialData?.card?.toString() ?? "");
    const [note, setNote] = useState(initialData?.note ?? "");

    const [isSaving, setIsSaving] = useState(false);

    const total = (parseFloat(cash) || 0) + (parseFloat(card) || 0);

    async function handleSave() {
        if (!date) return;

        setIsSaving(true);
        try {
            const data = {
                date,
                clients: Number(clients),
                cash: Number(cash),
                card: Number(card),
                note: note || null,
            };

            if (isEditMode) {
                await updateEntry(entryId, userId, isAdmin, data);
                toast.success("Záznam bol upravený");
                router.push("/history");
            } else {
                await saveEntry({ ...data, userId });
                toast.success("Deň bol úspešne uložený");
                setDate(new Date());
                setClients("");
                setCash("");
                setCard("");
                setNote("");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        router.push("/history");
    }

    return (
        <Card className="border-border bg-transparent shadow-none">
            <CardContent className="flex flex-col gap-6 px-4">
                {isEditMode && (
                    <div className="border-primary bg-secondary flex items-center justify-between rounded-lg border px-4 py-3">
                        <span className="text-primary flex items-center gap-2 text-sm font-semibold">
                            <Pencil className="h-4 w-4" />
                            Upravuješ existujúci záznam
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="border-primary text-primary"
                        >
                            Zrušiť
                        </Button>
                    </div>
                )}

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
                    {isSaving ? "Ukladám..." : isEditMode ? "Uložiť zmeny" : "Uložiť deň"}
                </Button>

            </CardContent>
        </Card>
    );
}
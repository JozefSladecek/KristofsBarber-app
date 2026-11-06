"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/generated/prisma/client";
import { restockProduct } from "@/entities/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";

type Mode = "add" | "set";

export function RestockSheet({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("add");
    const [amount, setAmount] = useState(product.lowStockThreshold * 4);
    const [isSaving, setIsSaving] = useState(false);

    const newStock = mode === "add" ? product.stock + amount : amount;

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await restockProduct({ productId: product.id, newStock });

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success("Stav bol uložený");
            setOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Drawer showSwipeHandle open={open} onOpenChange={setOpen}>
            <DrawerTrigger
                render={<Button variant="outline" size="sm" className="shrink-0 border-primary text-primary" />}
            >
                Doplniť
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1 p-4 pb-0">
                    <DrawerTitle className="text-lg font-bold text-foreground">{product.name}</DrawerTitle>
                    <DrawerDescription>
                        Teraz na sklade: <b className="text-foreground">{product.stock} ks</b> · hranica{" "}
                        {product.lowStockThreshold} ks
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-6 p-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="lg"
                            variant={mode === "add" ? "default" : "outline"}
                            onClick={() => setMode("add")}
                        >
                            Pripočítať
                        </Button>
                        <Button
                            size="lg"
                            variant={mode === "set" ? "default" : "outline"}
                            onClick={() => setMode("set")}
                        >
                            Nastaviť
                        </Button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="restock-amount">Počet</Label>
                        <div className="flex h-9 items-center rounded-lg border border-border bg-background px-3">
                            <Input
                                id="restock-amount"
                                inputMode="numeric"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                className="h-full border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
                            />
                            <span className="text-muted-foreground">ks</span>
                        </div>
                    </div>

                    <div className="flex items-baseline justify-between rounded-lg border border-accent bg-secondary px-4 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Nový stav
                        </span>
                        <span className="text-2xl font-bold text-primary tabular-nums">
                            <span className="text-lg font-normal text-muted-foreground">{product.stock} →</span>{" "}
                            {newStock} ks
                        </span>
                    </div>
                </div>

                <DrawerFooter>
                    <Button size="lg" onClick={handleSave} disabled={isSaving}>
                        Uložiť stav
                    </Button>
                    <DrawerClose render={<Button variant="outline" size="lg" disabled={isSaving} />}>
                        Zrušiť
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveSale } from "@/entities/sale";
import { useSale } from "./sale-context";

export function SaveBar() {
    const { date, cartItems, paymentMethod, note, clear } = useSale();
    const [isSaving, setIsSaving] = useState(false);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    async function handleSave() {
        if (!date || cartItems.length === 0) return;

        setIsSaving(true);
        try {
            const result = await saveSale({
                date,
                paymentMethod,
                note: note || null,
                items: cartItems.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    pricePerUnit: item.product.price,
                    quantity: item.quantity,
                })),
            });

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success("Nákup bol uložený");
            clear();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="sticky bottom-0 mt-2 flex flex-col gap-2 border-t border-border bg-background p-4">
            <div className="flex items-baseline justify-between rounded-lg border border-accent bg-secondary px-4 py-3">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Spolu · {totalQuantity} ks</span>
                <span className="text-2xl font-bold text-primary">
                    {totalPrice.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
                </span>
            </div>
            <Button
                onClick={handleSave}
                disabled={isSaving || cartItems.length === 0}
                className="h-11 w-full text-base font-bold uppercase tracking-wide"
            >
                Uložiť nákup
            </Button>
        </div>
    );
}

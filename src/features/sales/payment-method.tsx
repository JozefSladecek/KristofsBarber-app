"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSale } from "./sale-context";

export function PaymentMethod() {
    const { paymentMethod, setPaymentMethod } = useSale();

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Platba</Label>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant={paymentMethod === "CASH" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("CASH")}
                >
                    Hotovosť
                </Button>
                <Button
                    variant={paymentMethod === "CARD" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("CARD")}
                >
                    Karta
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markPayoutPaid, unmarkPayout } from "@/entities/overview";

type Payout = { id: string; amount: number } | null;

export function PayoutButton({
    userId,
    month,
    toReturn,
    payout,
}: {
    userId: string;
    month: Date;
    toReturn: number;
    payout: Payout;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const isSettled = payout !== null && toReturn <= 0;

    async function handleToggle() {
        setIsSaving(true);
        try {
            if (isSettled) {
                await unmarkPayout(payout!.id);
                toast.success("Vyplatenie zrušené");
            } else {
                await markPayoutPaid(userId, month, toReturn);
                toast.success("Označené ako vyplatené");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Button
            variant={isSettled ? "outline" : "default"}
            size="sm"
            disabled={isSaving}
            onClick={handleToggle}
        >
            {isSettled ? "Zmazať vyplatenie" : "Vyplatiť"}
        </Button>
    );
}

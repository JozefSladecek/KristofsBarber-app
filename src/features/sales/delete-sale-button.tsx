"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSale } from "@/entities/sale";

export function DeleteSaleButton({ saleId }: { saleId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm("Naozaj chceš zmazať tento nákup?")) return;

        setIsDeleting(true);
        try {
            const result = await deleteSale(saleId);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success("Nákup bol zmazaný");
            router.push("/sales/history");
        } catch (error) {
            toast.error("Nepodarilo sa zmazať nákup, skús to znova");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 border-t border-border pt-6">
            <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-11 w-full border-destructive/60 text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
                Zmazať nákup
            </Button>
        </div>
    );
}

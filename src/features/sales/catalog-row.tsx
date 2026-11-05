import { Minus, Plus, TriangleAlert } from "lucide-react";
import type { Product } from "@/generated/prisma/client";

export function CatalogRow({
    product,
    quantity,
    onAdd,
    onDecrement,
}: {
    product: Product;
    quantity: number;
    onAdd: () => void;
    onDecrement: () => void;
}) {
    return (
        <div className="flex min-h-12 w-full items-center gap-3 px-3">
            <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="truncate">{product.name}</span>
                {product.stock === 0 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <TriangleAlert className="h-3 w-3" />0 ks
                    </span>
                )}
            </span>
            <span className="shrink-0 tabular-nums">
                {product.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
            </span>
            {quantity > 0 && (
                <>
                    <button
                        onClick={onDecrement}
                        aria-label={`Ubrať ${product.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-4 shrink-0 text-center tabular-nums">{quantity}</span>
                </>
            )}
            <button
                onClick={onAdd}
                aria-label={`Pridať ${product.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>
    );
}

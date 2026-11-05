import { ChevronRight, TriangleAlert } from "lucide-react";
import type { Product } from "@/generated/prisma/client";
import { isLowStock } from "@/entities/product";

export function CatalogRow({ product }: { product: Product }) {
    const isLow = isLowStock(product);

    return (
        <div className="flex min-h-13 w-full items-center gap-3 px-3">
            <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className={product.active ? "" : "text-muted-foreground"}>{product.name}</span>
                {!product.active ? (
                    <span className="text-xs text-muted-foreground">Vyradené z predaja</span>
                ) : isLow ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <TriangleAlert className="h-3 w-3" />
                        Dochádza · {product.stock} / {product.lowStockThreshold} ks
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">{product.stock} ks</span>
                )}
            </span>
            <span className={`shrink-0 tabular-nums ${product.active ? "" : "text-muted-foreground"}`}>
                {product.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
    );
}

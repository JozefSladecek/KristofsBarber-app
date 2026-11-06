import { ChevronDown } from "lucide-react";
import type { Product } from "@/generated/prisma/client";
import { CATEGORY_LABELS, CATEGORIES, isLowStock } from "@/entities/product";
import { CatalogRow } from "./catalog-row";

export function CatalogList({
    activeProducts,
    retiredProducts,
}: {
    activeProducts: Product[];
    retiredProducts: Product[];
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {CATEGORIES.map((category) => {
                const items = activeProducts.filter((product) => product.category === category);
                if (items.length === 0) return null;

                const lowStockCount = items.filter(isLowStock).length;

                return (
                    <details key={category} className="border-border [&+details]:border-t">
                        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-3 hover:bg-muted">
                            <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                {CATEGORY_LABELS[category]} · {items.length}
                            </span>
                            {lowStockCount > 0 && (
                                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                                    {lowStockCount} dochádza
                                </span>
                            )}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </summary>
                        <ul className="divide-y divide-border border-t border-border bg-background">
                            {items.map((product) => (
                                <li key={product.id}>
                                    <CatalogRow product={product} />
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}
            {retiredProducts.length > 0 && (
                <details className="border-border [&+details]:border-t">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-3 hover:bg-muted">
                        <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Vyradené · {retiredProducts.length}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </summary>
                    <ul className="divide-y divide-border border-t border-border bg-background">
                        {retiredProducts.map((product) => (
                            <li key={product.id}>
                                <CatalogRow product={product} />
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}

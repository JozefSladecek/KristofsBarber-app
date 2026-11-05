"use client";

import { ChevronDown, Search } from "lucide-react";
import type { Product } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_LABELS, CATEGORIES } from "@/entities/product";
import { useSale } from "./sale-context";
import { CatalogRow } from "./catalog-row";

export function Catalog({ products }: { products: Product[] }) {
    const { cartItems, addItem, decrementItem } = useSale();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="catalog-search" className="text-muted-foreground text-xs uppercase tracking-wide">
                Katalóg
            </Label>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="catalog-search"
                    placeholder="Hľadať produkt alebo nápoj"
                    className="bg-card border-border pl-9"
                />
            </div>

            <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
                {CATEGORIES.map((category) => {
                    const items = products.filter((product) => product.category === category);
                    if (items.length === 0) return null;

                    return (
                        <details key={category} className="border-border [&+details]:border-t">
                            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-3 hover:bg-muted">
                                <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    {CATEGORY_LABELS[category]} · {items.length}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </summary>
                            <ul className="divide-y divide-border border-t border-border bg-background">
                                {items.map((product) => {
                                    const quantity = cartItems.find((item) => item.product.id === product.id)?.quantity ?? 0;

                                    return (
                                        <li key={product.id}>
                                            <CatalogRow
                                                product={product}
                                                quantity={quantity}
                                                onAdd={() => addItem(product)}
                                                onDecrement={() => decrementItem(product.id)}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </details>
                    );
                })}
            </div>
        </div>
    );
}

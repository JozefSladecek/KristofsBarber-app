"use client";

import { ChevronDown, Minus, Plus, Search, TriangleAlert } from "lucide-react";
import type { Product } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSale } from "./sale-context";

const CATEGORY_LABELS = {
    PRODUCT: "Produkty",
    DRINK: "Nápoje",
} as const;

const CATEGORIES = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];

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
                                                            onClick={() => decrementItem(product.id)}
                                                            aria-label={`Ubrať ${product.name}`}
                                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="min-w-4 shrink-0 text-center tabular-nums">
                                                            {quantity}
                                                        </span>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => addItem(product)}
                                                    aria-label={`Pridať ${product.name}`}
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
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

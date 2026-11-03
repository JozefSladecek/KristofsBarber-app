"use client";

import { Minus, Plus, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSale } from "./sale-context";

export function Cart() {
    const { cartItems, addItem, decrementItem } = useSale();

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Tento nákup</Label>
            {cartItems.length === 0 ? (
                <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
                    Zatiaľ žiadna položka. Klepni na produkt alebo nápoj v katalógu vyššie.
                </p>
            ) : (
                <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                    {cartItems.map(({ product, quantity }) => (
                        <li key={product.id} className="flex flex-col gap-2 p-3">
                            <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {product.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} € / ks
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label={`Ubrať ${product.name}`}
                                        onClick={() => decrementItem(product.id)}
                                    >
                                        <Minus />
                                    </Button>
                                    <span className="min-w-8 text-center text-lg tabular-nums">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label={`Pridať ${product.name}`}
                                        onClick={() => addItem(product)}
                                    >
                                        <Plus />
                                    </Button>
                                </span>
                                <span className="text-lg font-semibold tabular-nums">
                                    {(product.price * quantity).toLocaleString("sk-SK", {
                                        minimumFractionDigits: 2,
                                    })}{" "}
                                    €
                                </span>
                            </div>
                            {product.stock === 0 && (
                                <p className="flex gap-2 text-xs text-primary">
                                    <TriangleAlert className="h-4 w-4 shrink-0" />
                                    <span>Podľa skladu nie je na sklade. Nákup sa aj tak uloží.</span>
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

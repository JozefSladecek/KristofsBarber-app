"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Ban, Undo2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/generated/prisma/client";
import {
    CATEGORY_LABELS,
    CATEGORIES,
    createProduct,
    updateProduct,
    retireProduct,
    restoreProduct,
    productSchema,
} from "@/entities/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductForm({ product }: { product?: Product }) {
    const router = useRouter();
    const isEditMode = !!product;

    const [name, setName] = useState(product?.name ?? "");
    const [category, setCategory] = useState(product?.category ?? "PRODUCT");
    const [price, setPrice] = useState(product?.price.toString() ?? "");
    const [stock, setStock] = useState(product?.stock.toString() ?? "0");
    const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold.toString() ?? "3");

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    async function handleSave() {
        setIsSaving(true);
        try {
            const data = {
                name,
                category,
                price: Number(price),
                stock: Number(stock),
                lowStockThreshold: Number(lowStockThreshold),
            };

            const validation = productSchema.safeParse(data);
            if (!validation.success) {
                const fieldErrors: Record<string, string> = {};
                validation.error.issues.forEach((issue) => {
                    fieldErrors[String(issue.path[0])] = issue.message;
                });
                setErrors(fieldErrors);
                setIsSaving(false);
                return;
            }

            setErrors({});

            const result = isEditMode
                ? await updateProduct(product.id, validation.data)
                : await createProduct(validation.data);

            if (!result.success) {
                toast.error(result.error);
                setIsSaving(false);
                return;
            }

            toast.success(isEditMode ? "Zmeny boli uložené" : "Položka bola vytvorená");
            router.push("/catalog");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggleActive() {
        if (!product) return;

        setIsSaving(true);
        try {
            const result = product.active
                ? await retireProduct({ productId: product.id })
                : await restoreProduct({ productId: product.id });

            if (!result.success) {
                toast.error(result.error);
                setIsSaving(false);
                return;
            }

            toast.success(product.active ? "Položka bola vyradená" : "Položka bola vrátená do predaja");
            router.push("/catalog");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Nepodarilo sa uložiť, skús to znova");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    nativeButton={false}
                    render={<Link href="/catalog" />}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Katalóg
                </Button>
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {isEditMode ? "Upraviť položku" : "Nová položka"}
                </span>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Názov</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`h-9 text-lg ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>Kategória</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant={category === cat ? "default" : "outline"}
                                onClick={() => setCategory(cat)}
                            >
                                {CATEGORY_LABELS[cat]}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="price">Cena (€)</Label>
                    <div
                        className={`flex h-9 items-center rounded-lg border bg-background px-3 ${
                            errors.price ? "border-destructive" : "border-border"
                        }`}
                    >
                        <Input
                            id="price"
                            inputMode="decimal"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="h-full border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
                        />
                        <span className="text-muted-foreground">€</span>
                    </div>
                    {errors.price ? (
                        <span className="text-xs text-destructive">{errors.price}</span>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            Nová cena platí len pre budúce predaje. Staré nákupy sa nezmenia.
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="stock">Zostatok</Label>
                        <div
                            className={`flex h-9 items-center rounded-lg border bg-background px-3 ${
                                errors.stock ? "border-destructive" : "border-border"
                            }`}
                        >
                            <Input
                                id="stock"
                                inputMode="numeric"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="h-full border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
                            />
                            <span className="text-muted-foreground">ks</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="threshold" className="truncate">
                            Hranica „dochádza“
                        </Label>
                        <div
                            className={`flex h-9 items-center rounded-lg border bg-background px-3 ${
                                errors.lowStockThreshold ? "border-destructive" : "border-border"
                            }`}
                        >
                            <Input
                                id="threshold"
                                inputMode="numeric"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                className="h-full border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
                            />
                            <span className="text-muted-foreground">ks</span>
                        </div>
                    </div>
                </div>

                {isEditMode && (
                    <div className="flex flex-col items-center gap-2 border-t border-border pt-6">
                        <Button
                            variant="outline"
                            size="lg"
                            className={`w-full ${product.active ? "" : "border-primary text-primary"}`}
                            onClick={handleToggleActive}
                            disabled={isSaving}
                        >
                            {product.active ? (
                                <>
                                    <Ban className="h-4 w-4" />
                                    Vyradiť z predaja
                                </>
                            ) : (
                                <>
                                    <Undo2 className="h-4 w-4" />
                                    Vrátiť do predaja
                                </>
                            )}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            {product.active
                                ? "Skryje sa z výberu v Zápise, staré nákupy ostanú. Dá sa vrátiť."
                                : "Položka sa znova zobrazí v Zápise."}
                        </p>
                    </div>
                )}
            </div>

            <Button size="lg" onClick={handleSave} disabled={isSaving} className="w-full text-base font-bold uppercase tracking-wide">
                {isEditMode ? "Uložiť zmeny" : "Uložiť položku"}
            </Button>
        </div>
    );
}

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { isAdminOrOwner } from "@/lib/auth.config";
import { getProductsByIds, adjustStock } from "@/entities/product/server";
import { saleSchema, type SaleInput } from "./schema";
import { getSaleById } from "./queries";
import { updateSaleRecord, deleteSaleRecord } from "./mutations";

type ActionResult = { success: true } | { success: false; error: string };

export async function saveSale(data: SaleInput): Promise<ActionResult> {
    const validation = saleSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const { user, error } = await requireSession();
    if (error) return error;
    const userId = user.id;

    const { items, ...sale } = validation.data;

    const cartProducts = await getProductsByIds(items.map((item) => item.productId));

    if (cartProducts.length !== items.length) {
        return { success: false, error: "Niektorý produkt už neexistuje, skús to znova" };
    }

    try {
        await db.$transaction(async (tx) => {
            // allows negative stock - considered case about human error, e.g. owner forgot to add new stock to the system
            for (const item of items) {
                await adjustStock(tx, item.productId, item.quantity);
            }

            await tx.sale.create({
                data: {
                    ...sale,
                    userId,
                    items: {
                        create: items.map((item) => {
                            const product = cartProducts.find((p) => p.id === item.productId)!;
                            return {
                                productId: product.id,
                                productName: product.name,
                                pricePerUnit: product.price,
                                quantity: item.quantity,
                            };
                        }),
                    },
                },
            });
        });
    } catch (error) {
        console.error("saveSale failed", error);
        return { success: false, error: "Nepodarilo sa uložiť nákup, skús to znova" };
    }

    return { success: true };
}

export async function updateSale(id: string, data: SaleInput): Promise<ActionResult> {
    const validation = saleSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const { user, error } = await requireSession();
    if (error) return error;

    const isAdmin = isAdminOrOwner(user.role);
    // existing = pre-edit state
    const existing = await getSaleById(id, user.id, isAdmin);
    if (!existing) {
        return { success: false, error: "Nákup sa nenašiel" };
    }
    // items = post-edit state
    const { items, ...sale } = validation.data;

    const cartProducts = await getProductsByIds(items.map((item) => item.productId));

    if (cartProducts.length !== items.length) {
        return { success: false, error: "Niektorý produkt už neexistuje, skús to znova" };
    }

    const existingItemsByProductId = new Map(existing.items.map((item) => [item.productId, item]));
    const newProductIds = new Set(items.map((item) => item.productId));
    const removedItems = existing.items
        .filter((item) => !newProductIds.has(item.productId))
        .map((item) => ({ productId: item.productId, quantity: item.quantity }));

    try {
        await updateSaleRecord(id, {
            ...sale,
            removedItems,
            items: items.map((item) => {
                const product = cartProducts.find((p) => p.id === item.productId)!;
                const existingItem = existingItemsByProductId.get(item.productId);
                // items already in the sale keep the price and name recorded at the time of sale;
                // only newly added items are priced/named from the current product
                return {
                    productId: product.id,
                    productName: existingItem?.productName ?? product.name,
                    pricePerUnit: existingItem?.pricePerUnit ?? product.price,
                    quantity: item.quantity,
                    stockDelta: item.quantity - (existingItem?.quantity ?? 0),
                };
            }),
        });
    } catch (error) {
        console.error("updateSale failed", error);
        return { success: false, error: "Nepodarilo sa uložiť zmeny, skús to znova" };
    }

    revalidatePath("/sales/history");
    return { success: true };
}

export async function deleteSale(id: string): Promise<ActionResult> {
    const { user, error } = await requireSession();
    if (error) return error;

    const isAdmin = isAdminOrOwner(user.role);
    const existing = await getSaleById(id, user.id, isAdmin);
    if (!existing) {
        return { success: false, error: "Nákup sa nenašiel" };
    }

    try {
        await deleteSaleRecord(id, existing.items);
    } catch (error) {
        console.error("deleteSale failed", error);
        return { success: false, error: "Nepodarilo sa zmazať nákup, skús to znova" };
    }

    revalidatePath("/sales/history");
    return { success: true };
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { saleSchema, type SaleInput } from "./schema";

type ActionResult = { success: true } | { success: false; error: string };

export async function saveSale(data: SaleInput): Promise<ActionResult> {
    const validation = saleSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const session = await auth();
    const userId = session!.user!.id;

    const { items, ...sale } = validation.data;

    const cartProducts = await db.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
    });

    if (cartProducts.length !== items.length) {
        return { success: false, error: "Niektorý produkt už neexistuje, skús to znova" };
    }

    await db.sale.create({
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

    return { success: true };
}

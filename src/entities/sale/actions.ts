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

    await db.sale.create({
        data: {
            ...sale,
            userId,
            items: { create: items },
        },
    });

    return { success: true };
}

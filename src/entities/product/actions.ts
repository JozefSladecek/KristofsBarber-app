"use server";

import { revalidatePath } from "next/cache";
import { setStock, setActive } from "./mutations";
import { restockSchema, productIdSchema, type RestockInput, type ProductIdInput } from "./schema";

type ActionResult = { success: true } | { success: false; error: string };

export async function restockProduct(data: RestockInput): Promise<ActionResult> {
    const validation = restockSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    try {
        await setStock(validation.data.productId, validation.data.newStock);
    } catch (error) {
        console.error("restockProduct failed", error);
        return { success: false, error: "Nepodarilo sa uložiť stav, skús to znova" };
    }

    revalidatePath("/catalog");
    return { success: true };
}

export async function retireProduct(data: ProductIdInput): Promise<ActionResult> {
    const validation = productIdSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    try {
        await setActive(validation.data.productId, false);
    } catch (error) {
        console.error("retireProduct failed", error);
        return { success: false, error: "Nepodarilo sa vyradiť položku, skús to znova" };
    }

    revalidatePath("/catalog");
    return { success: true };
}

export async function restoreProduct(data: ProductIdInput): Promise<ActionResult> {
    const validation = productIdSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    try {
        await setActive(validation.data.productId, true);
    } catch (error) {
        console.error("restoreProduct failed", error);
        return { success: false, error: "Nepodarilo sa vrátiť položku do predaja, skús to znova" };
    }

    revalidatePath("/catalog");
    return { success: true };
}

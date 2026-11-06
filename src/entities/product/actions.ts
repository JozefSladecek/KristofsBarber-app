"use server";

import { revalidatePath } from "next/cache";
import { requireAdminOrOwner } from "@/lib/auth";
import { setStock, setActive, updateProductDetails, insertProduct } from "./mutations";
import {
    restockSchema,
    productIdSchema,
    productSchema,
    type RestockInput,
    type ProductIdInput,
    type ProductInput,
} from "./schema";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateProduct(productId: string, data: ProductInput): Promise<ActionResult> {
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

    const validation = productSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    try {
        await updateProductDetails(productId, validation.data);
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Položka s týmto názvom už existuje" };
        }
        console.error("updateProduct failed", error);
        return { success: false, error: "Nepodarilo sa uložiť zmeny, skús to znova" };
    }

    revalidatePath("/catalog");
    return { success: true };
}

export async function createProduct(data: ProductInput): Promise<ActionResult> {
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

    const validation = productSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    try {
        await insertProduct(validation.data);
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Položka s týmto názvom už existuje" };
        }
        console.error("createProduct failed", error);
        return { success: false, error: "Nepodarilo sa vytvoriť položku, skús to znova" };
    }

    revalidatePath("/catalog");
    return { success: true };
}

export async function restockProduct(data: RestockInput): Promise<ActionResult> {
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

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
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

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
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

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

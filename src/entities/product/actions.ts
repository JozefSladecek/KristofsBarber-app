"use server";

import { revalidatePath } from "next/cache";
import { setStock } from "./mutations";
import { restockSchema, type RestockInput } from "./schema";

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

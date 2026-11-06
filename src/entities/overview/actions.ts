"use server";

import { db } from "@/lib/db";
import { requireAdminOrOwner } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string };

export async function markPayoutPaid(userId: string, month: Date, outstanding: number): Promise<ActionResult> {
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

    await db.envelopePayout.upsert({
        where: { userId_month: { userId, month } },
        create: { userId, month, amount: outstanding },
        update: { amount: { increment: outstanding } }, // increment the amount to return if the record already exists
    });
    revalidatePath("/overview");
    return { success: true };
}

export async function unmarkPayout(id: string): Promise<ActionResult> {
    const { error: authError } = await requireAdminOrOwner();
    if (authError) return authError;

    await db.envelopePayout.delete({ where: { id } });
    revalidatePath("/overview");
    return { success: true };
}

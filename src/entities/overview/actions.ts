"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function assertIsOwnerOrAdmin(role: string) {
    if (role !== "ADMIN" && role !== "OWNER") {
        throw new Error("Nemáš oprávnenie na túto akciu");
    }
}

export async function markPayoutPaid(userId: string, month: Date, outstanding: number) {
    const session = await auth();
    assertIsOwnerOrAdmin(session!.user!.role);

    await db.envelopePayout.upsert({
        where: { userId_month: { userId, month } },
        create: { userId, month, amount: outstanding },
        update: { amount: { increment: outstanding } }, // increment the amount to return if the record already exists
    });
    revalidatePath("/overview");
}

export async function unmarkPayout(id: string) {
    const session = await auth();
    assertIsOwnerOrAdmin(session!.user!.role);

    await db.envelopePayout.delete({ where: { id } });
    revalidatePath("/overview");
}

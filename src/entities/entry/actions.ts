"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { entrySchema } from "./schema";

type SaveEntryInput = {
    date: Date;
    clients: number;
    cash: number;
    card: number;
    envelopeCash: number | null;
    note: string | null;
};

type UpdateEntryInput = {
    date: Date;
    clients: number;
    cash: number;
    card: number;
    envelopeCash: number | null;
    note: string | null;
};

type ActionResult = { success: true } | { success: false; error: string };

export async function saveEntry(data: SaveEntryInput): Promise<ActionResult> {
    const validation = entrySchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const session = await auth();
    const userId = session!.user!.id;

    try {
        await db.entry.create({ data: { ...data, userId } });
        revalidatePath("/history");
        revalidatePath("/overview");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Pre tento deň už existuje záznam" };
        }
        throw error;
    }
}

export async function updateEntry(id: string, data: UpdateEntryInput): Promise<ActionResult> {
    const validation = entrySchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const session = await auth();
    const userId = session!.user!.id;
    const isAdmin = session!.user!.role === "ADMIN" || session!.user!.role === "OWNER";

    try {
        await db.entry.updateMany({
            where: isAdmin ? { id } : { id, userId },
            data,
        });
        revalidatePath("/history");
        revalidatePath("/overview");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Pre tento deň už existuje záznam" };
        }
        throw error;
    }
}

export async function deleteEntry(id: string) {
    const session = await auth();
    const userId = session!.user!.id;
    const isAdmin = session!.user!.role === "ADMIN" || session!.user!.role === "OWNER";

    await db.entry.deleteMany({
        where: isAdmin ? { id } : { id, userId },
    });
    revalidatePath("/history");
    revalidatePath("/overview");
}
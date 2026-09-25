"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type SaveEntryInput = {
    date: Date;
    clients: number;
    cash: number;
    card: number;
    note: string | null;
    userId: string;
};

type UpdateEntryInput = {
    date: Date;
    clients: number;
    cash: number;
    card: number;
    note: string | null;
};

export async function saveEntry(data: SaveEntryInput) {
    try {
        await db.entry.create({ data });
        revalidatePath("/history");
        revalidatePath("/overview");
    } catch (error: any) {
        if (error.code === "P2002") {
            throw new Error("Pre tento deň už existuje záznam");
        }
        throw error;
    }
}

export async function updateEntry(
    id: string,
    userId: string,
    isAdmin: boolean,
    data: UpdateEntryInput
) {
    await db.entry.updateMany({
        where: isAdmin ? { id } : { id, userId },
        data,
    });
    revalidatePath("/history");
    revalidatePath("/overview");
}

export async function deleteEntry(id: string, userId: string, isAdmin: boolean) {
    await db.entry.deleteMany({
        where: isAdmin ? { id } : { id, userId },
    });
    revalidatePath("/history");
    revalidatePath("/overview");
}
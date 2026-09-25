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

export async function saveEntry(data: SaveEntryInput) {
    await db.entry.create({ data });
    revalidatePath("/history");
}

type UpdateEntryInput = {
    date: Date;
    clients: number;
    cash: number;
    card: number;
    note: string | null;
};

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
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
    revalidatePath("/historia");
}
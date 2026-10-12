"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

function assertValidEnvelopeCash(data: { cash: number; envelopeCash: number | null }) {
    if (data.envelopeCash !== null && data.envelopeCash < data.cash) {
        throw new Error("Do obálky nemôže byť menej ako hotovosť");
    }
}

export async function saveEntry(data: SaveEntryInput) {
    assertValidEnvelopeCash(data);

    const session = await auth();
    const userId = session!.user!.id;

    try {
        await db.entry.create({ data: { ...data, userId } });
        revalidatePath("/history");
        revalidatePath("/overview");
    } catch (error: any) {
        if (error.code === "P2002") {
            throw new Error("Pre tento deň už existuje záznam");
        }
        throw error;
    }
}

export async function updateEntry(id: string, data: UpdateEntryInput) {
    assertValidEnvelopeCash(data);

    const session = await auth();
    const userId = session!.user!.id;
    const isAdmin = session!.user!.role === "ADMIN" || session!.user!.role === "OWNER";

    await db.entry.updateMany({
        where: isAdmin ? { id } : { id, userId },
        data,
    });
    revalidatePath("/history");
    revalidatePath("/overview");
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
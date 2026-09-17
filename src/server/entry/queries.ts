import { db } from "@/lib/db";

export function getEntries(userId: string) {
    return db.entry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
}
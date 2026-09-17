import { db } from "@/lib/db";

export function getEntries(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return db.entry.findMany({
        where: {
            userId,
            date: {
                gte: startOfMonth,
                lt: startOfNextMonth,
            },
        },
        orderBy: { date: "desc" },
    });
}
import { db } from "@/lib/db";
import {getMonthRange} from "@/lib/date-utils";

export function getEntries(userId: string, month?: Date) {
    const { startOfMonth, startOfNextMonth } = getMonthRange(month);

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

export function getEntryById(id: string, userId: string, isAdmin: boolean) {
    return db.entry.findFirst({
        where: isAdmin ? { id } : { id, userId },
    });
}
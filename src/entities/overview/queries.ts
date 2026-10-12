import "server-only";
import { db } from "@/lib/db";
import { getMonthRange } from "@/lib/date-utils";
import { summarizeEntries, applyPaidOut } from "@/entities/entry";

export async function getOverviewData(month?: Date) {
    const { startOfMonth, startOfNextMonth } = getMonthRange(month);

    const entries = await db.entry.findMany({
        where: {
            date: { gte: startOfMonth, lt: startOfNextMonth },
            user: { role: { in: ["EMPLOYEE", "OWNER"] } },
        },
        include: {
            user: { select: { id: true, name: true } },
        },
    });

    const totalSummary = summarizeEntries(entries); // for all employees combined for the month

    const byEmployeeMap = new Map<string, { name: string; total: number; toReturn: number }>();
    for (const entry of entries) {
        const current = byEmployeeMap.get(entry.user.id) ?? { name: entry.user.name, total: 0, toReturn: 0 };
        current.total += entry.cash + entry.card;
        current.toReturn += (entry.envelopeCash ?? entry.cash) - entry.cash;
        byEmployeeMap.set(entry.user.id, current);
    }

    const payouts = await db.envelopePayout.findMany({ where: { month: startOfMonth } });
    const payoutByUserId = new Map(payouts.map((payout) => [payout.userId, payout]));
    const totalPaidOut = payouts.reduce((sum, payout) => sum + payout.amount, 0); // all employees payouts for the month

    const byEmployee = Array.from(byEmployeeMap.entries()).map(([userId, data]) => {
        const payout = payoutByUserId.get(userId) ?? null;
        return {
            userId,
            ...applyPaidOut(data, payout?.amount ?? 0),
            payout,
        };
    });

    return {
        totalSummary: applyPaidOut(totalSummary, totalPaidOut),
        byEmployee,
        month: startOfMonth,
    };
}

export async function getPayoutAmount(userId: string, month?: Date) {
    const { startOfMonth } = getMonthRange(month);
    const payout = await db.envelopePayout.findUnique({
        where: { userId_month: { userId, month: startOfMonth } },
    });
    return payout?.amount ?? 0;
}

export function getEmployeeEntries(userId: string) {
    const { startOfMonth, startOfNextMonth } = getMonthRange();

    return db.entry.findMany({
        where: {
            userId,
            date: { gte: startOfMonth, lt: startOfNextMonth },
        },
        orderBy: { date: "desc" },
    });
}

export function getAllEmployees() {
    return db.user.findMany({
        where: { role: { in: ["EMPLOYEE", "OWNER"] } },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
}
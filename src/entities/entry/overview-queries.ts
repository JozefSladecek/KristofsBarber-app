import { db } from "@/lib/db";

export async function getOverviewData(month?: Date) {
    const now = month ?? new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const entries = await db.entry.findMany({
        where: {
            date: { gte: startOfMonth, lt: startOfNextMonth },
        },
        include: {
            user: { select: { id: true, name: true } },
        },
    });

    const totalSummary = entries.reduce(
        (acc, entry) => ({
            clients: acc.clients + entry.clients,
            cash: acc.cash + entry.cash,
            card: acc.card + entry.card,
            total: acc.total + entry.cash + entry.card,
        }),
        { clients: 0, cash: 0, card: 0, total: 0 }
    );

    const byEmployeeMap = new Map<string, { name: string; total: number }>();
    for (const entry of entries) {
        const current = byEmployeeMap.get(entry.user.id) ?? { name: entry.user.name, total: 0 };
        current.total += entry.cash + entry.card;
        byEmployeeMap.set(entry.user.id, current);
    }
    const byEmployee = Array.from(byEmployeeMap.entries()).map(([userId, data]) => ({
        userId,
        name: data.name,
        total: data.total,
    }));

    return { totalSummary, byEmployee };
}
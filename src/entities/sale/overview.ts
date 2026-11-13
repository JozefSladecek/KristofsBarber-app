import type { getAllSales } from "./queries";
import { saleTotal, summarizeSales } from "./history";

type Sale = Awaited<ReturnType<typeof getAllSales>>[number];

// employees earn a cut of product sales only; drinks don't carry commission, and the owner takes none
const COMMISSION_RATE = 0.15;
const CATEGORY_LABELS = { PRODUCT: "Produkty", DRINK: "Nápoje" } as const;

export function summarizeOverview(sales: Sale[]) {
    const totalSummary = summarizeSales(sales);
    const quantity = sales.reduce(
        (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0,
    );

    return { totalSummary: { ...totalSummary, quantity } };
}

export function summarizeByEmployee(sales: Sale[]) {
    const byUserId = new Map<
        string,
        { name: string; isOwner: boolean; count: number; quantity: number; total: number; productRevenue: number }
    >();

    for (const sale of sales) {
        const current = byUserId.get(sale.user.id) ?? {
            name: sale.user.name,
            isOwner: sale.user.role === "OWNER",
            count: 0,
            quantity: 0,
            total: 0,
            productRevenue: 0,
        };
        current.count += 1;
        current.quantity += sale.items.reduce((sum, item) => sum + item.quantity, 0);
        current.total += saleTotal(sale);
        current.productRevenue += sale.items
            .filter((item) => item.product.category === "PRODUCT")
            .reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
        byUserId.set(sale.user.id, current);
    }

    return Array.from(byUserId.entries())
        .map(([userId, { productRevenue, isOwner, ...data }]) => ({
            userId,
            ...data,
            isOwner,
            commission: isOwner ? null : productRevenue * COMMISSION_RATE,
        }))
        .sort((a, b) => b.total - a.total);
}

export function summarizeByItem(sales: Sale[]) {
    const byCategory = new Map<string, Map<string, { productName: string; quantity: number; total: number }>>();

    for (const sale of sales) {
        for (const item of sale.items) {
            const items = byCategory.get(item.product.category) ?? new Map();
            const current = items.get(item.productId) ?? { productName: item.productName, quantity: 0, total: 0 };
            current.quantity += item.quantity;
            current.total += item.pricePerUnit * item.quantity;
            items.set(item.productId, current);
            byCategory.set(item.product.category, items);
        }
    }

    return Array.from(byCategory.entries())
        .map(([category, items]) => {
            const sortedItems = Array.from(items.values()).sort((a, b) => b.total - a.total);
            return {
                category,
                label: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS],
                quantity: sortedItems.reduce((sum, item) => sum + item.quantity, 0),
                total: sortedItems.reduce((sum, item) => sum + item.total, 0),
                items: sortedItems,
            };
        })
        .sort((a, b) => b.total - a.total);
}

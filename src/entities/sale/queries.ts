import "server-only";
import { db } from "@/lib/db";
import { getMonthRange } from "@/lib/date-utils";
import { isAdminOrOwner } from "@/lib/auth.config";
import { getProductsByIds } from "@/entities/product/server";

export function getSales(userId: string, month?: Date) {
    const { startOfMonth, startOfNextMonth } = getMonthRange(month);

    return db.sale.findMany({
        where: {
            userId,
            date: {
                gte: startOfMonth,
                lt: startOfNextMonth,
            },
        },
        include: { items: true },
        orderBy: { date: "desc" },
    });
}

export function getAllSales(month?: Date) {
    const { startOfMonth, startOfNextMonth } = getMonthRange(month);

    return db.sale.findMany({
        where: {
            date: { gte: startOfMonth, lt: startOfNextMonth },
            user: { role: { in: ["EMPLOYEE", "OWNER"] } },
        },
        include: {
            items: { include: { product: { select: { category: true } } } },
            user: { select: { id: true, name: true, role: true } },
        },
    });
}

export function getSaleById(id: string, userId: string, isAdmin: boolean) {
    return db.sale.findFirst({
        where: isAdmin ? { id } : { id, userId },
        include: { items: true },
    });
}

export async function getSaleFormData(id: string, userId: string, role: string) {
    const isAdmin = isAdminOrOwner(role);
    const sale = await getSaleById(id, userId, isAdmin);
    if (!sale) return null;

    const saleProducts = await getProductsByIds(sale.items.map((item) => item.productId));
    const cartItems = sale.items.map((item) => ({
        product: saleProducts.find((p) => p.id === item.productId)!,
        quantity: item.quantity,
    }));

    return { date: sale.date, cartItems, paymentMethod: sale.paymentMethod, note: sale.note ?? "" };
}

type SaleWithItems = { date: Date; items: { pricePerUnit: number; quantity: number }[] };
type SaleWithPayment = SaleWithItems & { paymentMethod: "CASH" | "CARD" };

export function saleTotal(sale: SaleWithItems) {
    return sale.items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
}

export function groupSalesByDay<T extends SaleWithItems>(sales: T[]) {
    const groups = new Map<string, T[]>();
    for (const sale of sales) {
        const key = sale.date.toISOString().slice(0, 10);
        groups.set(key, [...(groups.get(key) ?? []), sale]);
    }

    return Array.from(groups.entries()).map(([key, daySales]) => ({
        date: new Date(key),
        sales: daySales,
        total: daySales.reduce((sum, sale) => sum + saleTotal(sale), 0),
    }));
}

export function summarizeSales(sales: SaleWithPayment[]) {
    return sales.reduce(
        (acc, sale) => {
            const total = saleTotal(sale);
            return {
                count: acc.count + 1,
                cash: acc.cash + (sale.paymentMethod === "CASH" ? total : 0),
                card: acc.card + (sale.paymentMethod === "CARD" ? total : 0),
                total: acc.total + total,
            };
        },
        { count: 0, cash: 0, card: 0, total: 0 },
    );
}

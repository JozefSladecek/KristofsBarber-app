import "server-only";
import { db } from "@/lib/db";
import type { PaymentMethod } from "@/generated/prisma/client";
import { adjustStock } from "@/entities/product/server";

// stockDelta: change in quantity vs. what the sale previously held, used to adjust product stock accordingly
type SaleItemData = {
    productId: string;
    productName: string;
    pricePerUnit: number;
    quantity: number;
    stockDelta: number;
};
type SaleData = {
    date: Date;
    paymentMethod: PaymentMethod;
    note: string | null;
    items: SaleItemData[];
    // products no longer part of the sale after the edit; their stock is restored in full
    removedItems: { productId: string; quantity: number }[];
};

export async function updateSaleRecord(id: string, data: SaleData) {
    const { items, removedItems, ...sale } = data;

    await db.$transaction(async (tx) => {
        for (const item of items) {
            if (item.stockDelta !== 0) {
                await adjustStock(tx, item.productId, item.stockDelta);
            }
        }

        for (const removedItem of removedItems) {
            await adjustStock(tx, removedItem.productId, -removedItem.quantity);
        }

        await tx.saleItem.deleteMany({ where: { saleId: id } });
        await tx.sale.update({
            where: { id },
            data: {
                ...sale,
                items: {
                    create: items.map(({ stockDelta, ...item }) => item),
                },
            },
        });
    });
}

export async function deleteSaleRecord(id: string, items: { productId: string; quantity: number }[]) {
    await db.$transaction(async (tx) => {
        for (const item of items) {
            await adjustStock(tx, item.productId, -item.quantity);
        }
        await tx.sale.delete({ where: { id } });
    });
}

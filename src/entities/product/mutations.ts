import "server-only";
import type { Prisma, ProductCategory } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export function decrementStock(tx: Prisma.TransactionClient, productId: string, quantity: number) {
    return tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
    });
}

export function setStock(productId: string, newStock: number) {
    return db.product.update({
        where: { id: productId },
        data: { stock: newStock },
    });
}

export function setActive(productId: string, active: boolean) {
    return db.product.update({
        where: { id: productId },
        data: { active },
    });
}

type ProductDetails = { name: string; category: ProductCategory; price: number; stock: number; lowStockThreshold: number };

export function updateProductDetails(productId: string, data: ProductDetails) {
    return db.product.update({
        where: { id: productId },
        data,
    });
}

export function insertProduct(data: ProductDetails) {
    return db.product.create({ data });
}

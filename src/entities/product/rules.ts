import type { Product } from "@/generated/prisma/client";

export function isLowStock(product: Product) {
    return product.active && product.stock <= product.lowStockThreshold;
}

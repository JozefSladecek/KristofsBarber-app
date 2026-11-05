import "server-only";
import { db } from "@/lib/db";

export function getProducts() {
    return db.product.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });
}

export function getRetiredProducts() {
    return db.product.findMany({
        where: { active: false },
        orderBy: { name: "asc" },
    });
}

export function getProductsByIds(ids: string[]) {
    return db.product.findMany({
        where: { id: { in: ids } },
    });
}

import "server-only";
import { db } from "@/lib/db";

export function getProducts() {
    return db.product.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });
}

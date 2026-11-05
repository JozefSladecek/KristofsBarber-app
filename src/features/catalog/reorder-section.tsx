import { TriangleAlert } from "lucide-react";
import type { Product } from "@/generated/prisma/client";
import { RestockSheet } from "./restock-sheet";

export function ReorderSection({ products }: { products: Product[] }) {
    if (products.length === 0) return null;

    return (
        <section className="flex flex-col overflow-hidden rounded-lg border border-primary bg-secondary">
            <h3 className="flex items-center gap-1.5 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-primary">
                <TriangleAlert className="h-4 w-4" />
                Treba objednať · {products.length}
            </h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="flex items-center gap-3 border-t border-border px-3 py-2">
                        <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                            <span className="truncate">{product.name}</span>
                            <span className="text-xs font-semibold text-primary">
                                {product.stock} / {product.lowStockThreshold} ks
                            </span>
                        </span>
                        <RestockSheet product={product} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

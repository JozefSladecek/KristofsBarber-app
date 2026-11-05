import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { getProducts, getRetiredProducts } from "@/entities/product/server";
import { isLowStock } from "@/entities/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReorderSection } from "./reorder-section";
import { CatalogList } from "./catalog-list";

export async function CatalogPage() {
    const [activeProducts, retiredProducts] = await Promise.all([getProducts(), getRetiredProducts()]);
    const lowStockProducts = activeProducts.filter(isLowStock);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Hľadať položku" className="h-10 bg-card pl-9" />
                </div>
                <Button nativeButton={false} render={<Link href="/catalog/new" />}>
                    <Plus className="h-4 w-4" />
                    Pridať
                </Button>
            </div>
            <ReorderSection products={lowStockProducts} />
            <CatalogList activeProducts={activeProducts} retiredProducts={retiredProducts} />
        </div>
    );
}

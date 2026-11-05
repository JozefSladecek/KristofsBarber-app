import { getProducts, getRetiredProducts } from "@/entities/product/server";
import { isLowStock } from "@/entities/product";
import { ReorderSection } from "./reorder-section";
import { CatalogList } from "./catalog-list";

export async function CatalogPage() {
    const [activeProducts, retiredProducts] = await Promise.all([getProducts(), getRetiredProducts()]);
    const lowStockProducts = activeProducts.filter(isLowStock);

    return (
        <div className="flex flex-col gap-4 p-4">
            <ReorderSection products={lowStockProducts} />
            <CatalogList activeProducts={activeProducts} retiredProducts={retiredProducts} />
        </div>
    );
}

import { notFound } from "next/navigation";
import { getProductById } from "@/entities/product/server";
import { ProductForm } from "./product-form";

export async function EditProductPage({ id }: { id: string }) {
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <ProductForm product={product} />
        </div>
    );
}

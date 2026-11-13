import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getSaleFormData } from "@/entities/sale/server";
import { getProducts } from "@/entities/product/server";
import { DateField } from "./date-field";
import { Catalog } from "./catalog";
import { Cart } from "./cart";
import { PaymentMethod } from "./payment-method";
import { NoteField } from "./note-field";
import { SaveBar } from "./save-bar";
import { DeleteSaleButton } from "./delete-sale-button";
import { SaleProvider } from "./sale-context";

export async function SalesEntryPage({ saleId }: { saleId?: string } = {}) {
    const products = await getProducts();

    let initial;
    if (saleId) {
        // edit mode: load the existing sale so the form opens pre-filled instead of empty
        const { user, error } = await requireSession();
        if (error) {
            notFound();
        }

        initial = await getSaleFormData(saleId, user.id, user.role);
        if (!initial) {
            notFound();
        }
    }

    return (
        <SaleProvider initial={initial}>
            <div className="flex flex-col">
                <div className="flex flex-col gap-6 p-4">
                    <DateField />
                    <Catalog products={products} />
                    <Cart />
                    <PaymentMethod />
                    <NoteField />
                    {saleId && <DeleteSaleButton saleId={saleId} />}
                </div>

                <SaveBar saleId={saleId} />
            </div>
        </SaleProvider>
    );
}

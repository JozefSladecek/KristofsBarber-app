import { getProducts } from "@/entities/product/server";
import { DateField } from "./date-field";
import { Catalog } from "./catalog";
import { Cart } from "./cart";
import { PaymentMethod } from "./payment-method";
import { NoteField } from "./note-field";
import { SaveBar } from "./save-bar";
import { SaleProvider } from "./sale-context";

export async function SalesEntryPage() {
    const products = await getProducts();

    return (
        <SaleProvider>
            <div className="flex flex-col">
                <div className="flex flex-col gap-6 p-4">
                    <DateField />
                    <Catalog products={products} />
                    <Cart />
                    <PaymentMethod />
                    <NoteField />
                </div>

                <SaveBar />
            </div>
        </SaleProvider>
    );
}

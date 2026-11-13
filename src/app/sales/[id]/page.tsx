import { SalesEntryPage } from "@/features/sales/sales-entry-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <SalesEntryPage saleId={id} />
        </div>
    );
}

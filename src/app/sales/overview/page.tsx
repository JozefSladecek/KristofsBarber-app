import { SalesOverviewPage } from "@/features/sales/overview/sales-overview-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
    const { month } = await searchParams;
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <SalesOverviewPage month={month} />
        </div>
    );
}

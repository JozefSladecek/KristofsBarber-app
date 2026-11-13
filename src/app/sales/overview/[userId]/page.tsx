import { EmployeeHistoryPage } from "@/features/sales/overview/employee-history-page";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string }>;
    searchParams: Promise<{ month?: string }>;
}) {
    const { userId } = await params;
    const { month } = await searchParams;
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <EmployeeHistoryPage userId={userId} month={month} />
        </div>
    );
}

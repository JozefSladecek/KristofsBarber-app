import { OverviewPage } from "@/features/overview/overview-page";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ employee?: string; month?: string }>;
}) {
    const { employee, month } = await searchParams;
    return (
        <div className="h-full min-h-0">
            <OverviewPage selectedUserId={employee} month={month} />
        </div>
    );
}
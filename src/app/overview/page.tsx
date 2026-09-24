import { OverviewPage } from "@/features/overview/overview-page";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ employee?: string }>;
}) {
    const { employee } = await searchParams;
    return <OverviewPage selectedUserId={employee} />;
}
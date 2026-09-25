import { HistoryPage } from "@/features/history/history-page";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ month?: string }>;
}) {
    const { month } = await searchParams;
    return <HistoryPage month={month} />;
}
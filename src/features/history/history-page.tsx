import { auth } from "@/lib/auth";
import { HistoryList } from "@/features/history/history-list";

export async function HistoryPage({ month }: { month?: string }) {
    const session = await auth();
    const currentMonth = month ? new Date(`${month}-01`) : new Date();

    return (
        <div className="h-full min-h-0">
            <HistoryList userId={session!.user!.id} month={currentMonth} />
        </div>
    );
}
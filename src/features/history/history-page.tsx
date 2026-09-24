import { auth } from "@/lib/auth";
import { HistoryList } from "@/features/history/history-list";

export async function HistoryPage() {
    const session = await auth();
    return (
        <div className="h-full min-h-0">
            <HistoryList userId={session!.user!.id} />
        </div>
    );
}
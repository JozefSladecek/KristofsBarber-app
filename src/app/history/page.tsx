import { HistoryList } from "@/features/history/history-list";

export default function HistoryPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background">
      <HistoryList />
    </div>
  );
}

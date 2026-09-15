import { EntryForm } from "@/features/entry/entry-form";

export default function Home() {
  return (
      <div className="flex flex-col flex-1 min-h-screen bg-background">
        <EntryForm />
      </div>
  );
}
import { auth } from "@/lib/auth";
import { getEntryById } from "@/entities/entry/queries";
import { EntryForm } from "@/features/entry/entry-form";
import { notFound } from "next/navigation";

export async function EditEntryPage({ id }: { id: string }) {
    const session = await auth();
    const userId = session!.user!.id;
    const isAdmin = session!.user!.role === "ADMIN";

    const entry = await getEntryById(id, userId, isAdmin);

    if (!entry) {
        notFound();
    }

    return (
        <div className="flex flex-col flex-1 min-h-screen bg-background">
            <EntryForm
                userId={userId}
                entryId={entry.id}
                isAdmin={isAdmin}
                initialData={{
                    date: entry.date,
                    clients: entry.clients,
                    cash: entry.cash,
                    card: entry.card,
                    note: entry.note,
                }}
            />
        </div>
    );
}
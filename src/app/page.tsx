import { auth } from "@/lib/auth";
import { EntryForm } from "@/features/entry/entry-form";

export default async function Home() {
    const session = await auth();
    const userId = session!.user!.id;

    return (
        <div className="flex flex-col flex-1 min-h-screen bg-background">
            <EntryForm userId={userId} />
        </div>
    );
}
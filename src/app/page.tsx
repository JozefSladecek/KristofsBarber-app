import { auth } from "@/lib/auth";
import { EntryForm } from "@/features/entry/entry-form";

export default async function Home() {
    const session = await auth();
    const userId = session!.user!.id;
    const isAdmin = session!.user!.role === "ADMIN";

    return (
        <div className="flex flex-col flex-1 bg-background">
            <EntryForm userId={userId} isAdmin={isAdmin} />
        </div>
    );
}
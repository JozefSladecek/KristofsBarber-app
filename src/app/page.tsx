import { auth } from "@/lib/auth";
import { EntryForm } from "@/features/entry/entry-form";

export default async function Home() {
    return (
        <div className="flex flex-col flex-1 bg-background">
            <EntryForm />
        </div>
    );
}
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export async function Header() {
    const session = await auth();

    return (
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Prihlásený: <span className="text-foreground font-semibold">{session?.user?.name}</span>
            </span>
            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                }}
            >
                <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
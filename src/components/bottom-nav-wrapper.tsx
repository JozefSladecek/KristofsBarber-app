import { auth } from "@/lib/auth";
import { BottomNav } from "@/components/bottom-nav";

export async function BottomNavWrapper() {
    const session = await auth();
    const role = session?.user?.role;

    if (!role) {
        return null;
    }

    return <BottomNav role={role} />;
}
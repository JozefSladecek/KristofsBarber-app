import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig, isAdminOrOwner } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Meno", type: "text" },
                password: { label: "Heslo", type: "password" },
            },
            authorize: async (credentials) => {
                const username = credentials.username as string;
                const password = credentials.password as string;

                const user = await db.user.findUnique({ where: { username } });
                if (!user) return null;

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                return { id: user.id, name: user.name, role: user.role };
            },
        }),
    ],
});

type AuthError = { success: false; error: string };
type SessionUser = { id: string; role: string };
type SessionResult = { user: SessionUser; error: null } | { user: null; error: AuthError };

export async function requireSession(): Promise<SessionResult> {
    const session = await auth();
    if (!session?.user?.id) {
        return { user: null, error: { success: false, error: "Musíš byť prihlásený" } };
    }
    return { user: session.user, error: null };
}

export async function requireAdminOrOwner(): Promise<SessionResult> {
    const result = await requireSession();
    if (result.error) return result;

    if (!isAdminOrOwner(result.user.role)) {
        return { user: null, error: { success: false, error: "Nemáš oprávnenie na túto akciu" } };
    }
    return result;
}
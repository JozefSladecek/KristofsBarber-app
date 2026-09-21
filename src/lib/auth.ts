import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

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
    callbacks: {
        jwt({ token, user }: { token: JWT; user?: { id: string; role: string } }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            return session;
        },
    },
});
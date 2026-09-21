import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [], // only used for type inference, actual providers are defined in src/lib/auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isLoginPage = nextUrl.pathname === "/login";

            if (!isLoggedIn && !isLoginPage) return false;
            if (isLoggedIn && isLoginPage) return Response.redirect(new URL("/", nextUrl));
            return true;
        },
    },
};
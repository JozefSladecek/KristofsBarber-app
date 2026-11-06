export function isAdminOrOwner(role: string | undefined | null) {
    return role === "ADMIN" || role === "OWNER";
}

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }: any) {
            const isLoggedIn = !!auth?.user;
            const isLoginPage = nextUrl.pathname === "/login";
            const isOverviewPage = nextUrl.pathname.startsWith("/overview");
            const isCatalogPage = nextUrl.pathname.startsWith("/catalog");
            // todo overview page for prodcuts is laso forbidden for non-admin/owner
            const isAdmin = isAdminOrOwner(auth?.user?.role);

            if (!isLoggedIn && !isLoginPage) return false;
            if (isLoggedIn && isLoginPage) return Response.redirect(new URL("/", nextUrl));
            if ((isOverviewPage || isCatalogPage) && !isAdmin) {
                return new Response("Forbidden", { status: 403 });
            }
            return true;
        },
        jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};
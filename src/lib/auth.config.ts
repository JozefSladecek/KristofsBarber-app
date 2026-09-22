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
            const isOverviewPage = nextUrl.pathname.startsWith("/prehlad");
            const isAdmin = auth?.user?.role === "ADMIN" || auth?.user?.role === "OWNER";

            if (!isLoggedIn && !isLoginPage) return false;
            if (isLoggedIn && isLoginPage) return Response.redirect(new URL("/", nextUrl));

            if (isOverviewPage && !isAdmin) {
                return new Response("Forbidden", { status: 403 });
            }

            return true;
        },
    },
};
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

            if (!isLoggedIn && !isLoginPage) return false;
            if (isLoggedIn && isLoginPage) return Response.redirect(new URL("/", nextUrl));
            return true;
        },
    },
};
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      // Force first-login password change before any gated area. The
      // /change-password route is outside the middleware matcher, so this never
      // loops.
      if (isLoggedIn && auth?.user?.mustChangePassword) {
        return Response.redirect(new URL("/change-password", nextUrl));
      }

      if (path.startsWith("/admin")) {
        if (isLoggedIn && role === "ADMIN") return true;
        if (isLoggedIn) return Response.redirect(new URL("/portal", nextUrl));
        return false;
      }
      if (path.startsWith("/portal")) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.mustChangePassword = user.mustChangePassword ?? false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "CUSTOMER";
        session.user.id = token.id as string;
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

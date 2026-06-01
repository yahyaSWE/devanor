import { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "CUSTOMER";

declare module "next-auth" {
  interface User {
    role: AppRole;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AppRole;
    id: string;
  }
}

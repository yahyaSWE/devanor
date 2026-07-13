import { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "CUSTOMER";

declare module "next-auth" {
  interface User {
    role: AppRole;
    mustChangePassword?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AppRole;
    id: string;
    mustChangePassword: boolean;
  }
}

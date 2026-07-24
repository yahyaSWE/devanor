import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Thrown when the password is correct but the account (or its company) has been
// deactivated — surfaced to the login form with a specific message.
class InactiveAccountError extends CredentialsSignin {
  code = "account_inactive";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Idle timeout: the JWT expires after 30 min of inactivity; it is refreshed
  // (updateAge) at most every 5 min while the user is active.
  session: { strategy: "jwt", maxAge: 30 * 60, updateAge: 5 * 60 },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
          include: { client: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Block deactivated user accounts.
        if (!user.active) throw new InactiveAccountError();

        // Block employees whose company has been deactivated.
        if (user.role === "CUSTOMER" && user.client && !user.client.active) {
          throw new InactiveAccountError();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
});

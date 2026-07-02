import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-20">
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
        <Link href="/login" className="text-sm text-muted hover:text-foreground">
          ← Back to sign in
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Choose a new password</h1>
        <ResetPasswordForm token={token ?? ""} />
      </div>
    </main>
  );
}

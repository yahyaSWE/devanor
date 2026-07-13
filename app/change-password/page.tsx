import { requireUser } from "@/lib/auth-helpers";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";

export const metadata = { title: "Set a new password" };

export default async function ChangePasswordPage() {
  await requireUser();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <p className="mt-1 mb-4 text-sm text-muted">
          For your security, choose a new password before continuing. You&apos;ll
          sign in again with it.
        </p>
        <ChangePasswordForm signOutOnSuccess />
      </div>
    </div>
  );
}

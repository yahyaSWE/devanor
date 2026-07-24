import { requireAdmin } from "@/lib/auth-helpers";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";
import { TemplatesManager } from "@/components/admin/TemplatesManager";
import { listTemplates } from "@/lib/welcome";

export const metadata = { title: "Admin · Account" };

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  const templates = await listTemplates();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="mt-1 text-muted">Your admin profile and security settings.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd>{session.user.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email</dt>
              <dd className="truncate">{session.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Role</dt>
              <dd>Administrator</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Change password</h2>
          <p className="mb-4 mt-1 text-sm text-muted">Use at least 8 characters.</p>
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-6">
        <TemplatesManager templates={templates} />
      </div>
    </div>
  );
}

import { requireUser } from "@/lib/auth-helpers";
import { getPortalUser } from "@/lib/portal";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";

export const metadata = { title: "Account" };

export default async function PortalAccountPage() {
  const session = await requireUser();
  const user = await getPortalUser(session.user.id);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Account</h1>
        <p className="mt-2 text-muted">Your profile and security settings.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd>{user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Role</dt>
              <dd>{user?.title ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email</dt>
              <dd className="truncate">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Company</dt>
              <dd>{user?.client?.name ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="font-semibold">Change password</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Use at least 8 characters.
          </p>
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}

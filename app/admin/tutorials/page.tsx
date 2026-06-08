import { prisma } from "@/lib/db";
import { AddTutorialForm } from "@/components/admin/AddTutorialForm";
import { deleteTutorial } from "@/lib/actions/admin-content";

export const metadata = { title: "Admin · Tutorials" };

export default async function AdminTutorialsPage() {
  const [clients, tutorials] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Tutorials</h1>
      <p className="mt-1 text-muted">
        Gated training material shown to signed-in customers.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Add a tutorial</h2>
          <AddTutorialForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Tutorials ({tutorials.length})</h2>
          {tutorials.length === 0 ? (
            <p className="text-sm text-muted">No tutorials yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {tutorials.map((t) => (
                <li key={t.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{t.title}</p>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        {t.level}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted">
                      {t.client ? t.client.name : "All customers"} · {t.url}
                    </p>
                  </div>
                  <form action={deleteTutorial}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-sm text-muted hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { AddLicenseModuleForm } from "@/components/admin/AddLicenseModuleForm";
import {
  LicenseCatalogManager,
  type CatalogModule,
} from "@/components/admin/LicenseCatalogManager";

export const metadata = { title: "Admin · Licenses" };

export default async function AdminLicensesPage() {
  const modules = await prisma.licenseModule.findMany({
    orderBy: { name: "asc" },
    include: {
      licenses: {
        include: { client: { select: { id: true, name: true } } },
      },
    },
  });

  // Dedupe companies per module.
  const catalog: CatalogModule[] = modules.map((m) => {
    const seen = new Map<string, string>();
    for (const l of m.licenses) seen.set(l.client.id, l.client.name);
    return {
      id: m.id,
      name: m.name,
      companies: Array.from(seen, ([id, name]) => ({ id, name })),
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">License catalog</h1>
      <p className="mt-1 text-muted">
        Create license modules here (name only). Assign them — with contract type,
        keys and seats — from each company&apos;s Manage page.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-semibold">Add module</h2>
          <AddLicenseModuleForm />
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <LicenseCatalogManager modules={catalog} />
        </div>
      </div>
    </div>
  );
}

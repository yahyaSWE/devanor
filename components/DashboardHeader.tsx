import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { site } from "@/lib/site";

export function DashboardHeader({
  label,
  email,
}: {
  label: string;
  email: string;
}) {
  return (
    <header className="border-b border-border bg-surface/40">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[#04110d] text-sm font-bold">
              D
            </span>
            {site.name}
          </Link>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

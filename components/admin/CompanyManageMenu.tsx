"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { EditCompanyForm } from "./EditCompanyForm";
import { LicenseForm } from "./LicenseForm";
import { SendWelcomeMail } from "./SendWelcomeMail";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import {
  deleteClientAndRedirect,
  toggleClientActive,
  toggleClientVisibility,
} from "@/lib/actions/admin";

type Panel = "edit" | "employee" | "license" | "welcome";

type Props = {
  client: {
    id: string;
    name: string;
    websiteUrl: string;
    address: string | null;
    active: boolean;
    showOnSite: boolean;
  };
  modules: { id: string; name: string }[];
  employees: { id: string; name: string | null; email: string }[];
  welcomeTemplate: { subject: string; body: string };
  loginUrl: string;
};

function MenuButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/5"
    >
      {children}
    </button>
  );
}

export function CompanyManageMenu({
  client,
  modules,
  employees,
  welcomeTemplate,
  loginUrl,
}: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close modal on Escape.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const open = (p: Panel) => {
    setMenuOpen(false);
    setPanel(p);
  };
  const closePanel = () => setPanel(null);
  const onSuccess = () => {
    setPanel(null);
    router.refresh();
  };

  const panelTitle: Record<Panel, string> = {
    edit: "Edit company",
    employee: "Add an employee",
    license: "Assign a license",
    welcome: "Send welcome mail",
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Company actions"
        aria-expanded={menuOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/30"
      >
        <span className="flex flex-col gap-[5px]">
          <span className="block h-0.5 w-5 rounded bg-foreground" />
          <span className="block h-0.5 w-5 rounded bg-foreground" />
          <span className="block h-0.5 w-5 rounded bg-foreground" />
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-2xl">
          <MenuButton onClick={() => open("edit")}>Edit company</MenuButton>
          <MenuButton onClick={() => open("employee")}>Add an employee</MenuButton>
          <MenuButton onClick={() => open("license")}>Assign a license</MenuButton>
          <MenuButton onClick={() => open("welcome")}>Send welcome mail</MenuButton>

          <div className="my-1 border-t border-border" />

          <div className="px-1">
            <ConfirmSubmit
              action={toggleClientVisibility}
              hidden={{ id: client.id }}
              tone="primary"
              trigger={client.showOnSite ? "Hide from site" : "Show on site"}
              confirmLabel={client.showOnSite ? "Hide from site" : "Show on site"}
              title={client.showOnSite ? "Hide from site?" : "Show on site?"}
              message={
                client.showOnSite
                  ? `“${client.name}” will no longer appear in “Our Clients” on the public website.`
                  : `“${client.name}” will appear in “Our Clients” on the public website.`
              }
              triggerClassName="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/5"
            />
            <ConfirmSubmit
              action={toggleClientActive}
              hidden={{ id: client.id }}
              tone="primary"
              trigger={client.active ? "Deactivate" : "Activate"}
              confirmLabel={client.active ? "Deactivate" : "Activate"}
              title={client.active ? "Deactivate company?" : "Activate company?"}
              message={
                client.active
                  ? `Employees at “${client.name}” will no longer be able to sign in to the portal. Its logo stays visible on the site.`
                  : `Employees at “${client.name}” will be able to sign in to the portal again.`
              }
              triggerClassName="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/5"
            />
          </div>

          <div className="my-1 border-t border-border" />

          <div className="px-1">
            <ConfirmSubmit
              action={deleteClientAndRedirect}
              hidden={{ id: client.id }}
              trigger="Delete company"
              confirmLabel="Delete company"
              requireText="DELETE"
              title="Delete company?"
              message={`This permanently removes "${client.name}"${
                employees.length > 0
                  ? ` and its ${employees.length} employee login${
                      employees.length === 1 ? "" : "s"
                    }`
                  : ""
              }. This cannot be undone.`}
              triggerClassName="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
            />
          </div>
        </div>
      )}

      {panel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePanel}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">{panelTitle[panel]}</h2>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {panel === "edit" && (
              <EditCompanyForm
                client={{
                  id: client.id,
                  name: client.name,
                  websiteUrl: client.websiteUrl,
                  address: client.address,
                }}
                onSuccess={onSuccess}
              />
            )}

            {panel === "employee" && (
              <>
                <p className="mb-4 text-sm text-muted">
                  Creates a portal login under {client.name}. Each employee signs
                  in with their own email.
                </p>
                <AddEmployeeForm clientId={client.id} onSuccess={onSuccess} />
              </>
            )}

            {panel === "license" && (
              <>
                <p className="mb-4 text-sm text-muted">
                  Pick one or more modules from the catalog (created in the
                  Licenses tab).
                </p>
                <LicenseForm
                  clientId={client.id}
                  modules={modules}
                  onDone={onSuccess}
                />
              </>
            )}

            {panel === "welcome" && (
              <SendWelcomeMail
                clientId={client.id}
                employees={employees}
                template={welcomeTemplate}
                companyName={client.name}
                loginUrl={loginUrl}
                embedded
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

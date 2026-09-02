"use client";

import { logout } from "@/lib/actions/auth";
import { Button } from "./Button";

export function LogoutButton() {
  return (
    <form action={logout} onSubmit={() => window.$chatwoot?.reset?.()}>
      <Button variant="outline" type="submit">
        Sign out
      </Button>
    </form>
  );
}

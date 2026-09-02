"use client";

import { logout } from "@/lib/actions/auth";
import { Button } from "./Button";

export function LogoutButton() {
  function clearChatSession() {
    window.$chatwoot?.toggle("close");
    window.$chatwoot?.toggleBubbleVisibility("hide");
    window.$chatwoot?.reset();
  }

  return (
    <form action={logout} onSubmit={clearChatSession}>
      <Button variant="outline" type="submit">
        Sign out
      </Button>
    </form>
  );
}

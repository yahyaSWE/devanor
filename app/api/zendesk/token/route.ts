import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/auth";
import { getPortalUser } from "@/lib/portal";

// Signs a short-lived JWT that identifies the logged-in customer to the Zendesk
// messaging widget (end-user authentication). The widget calls this via
// `zE("messenger", "loginUser", …)`. No-ops with 501 until the messaging signing
// key is configured, so the chat still works unauthenticated in the meantime.
export async function GET() {
  const keyId = process.env.ZENDESK_MESSAGING_KEY_ID;
  const secret = process.env.ZENDESK_MESSAGING_SECRET;
  if (!keyId || !secret) {
    return NextResponse.json(
      { error: "Zendesk messaging auth not configured" },
      { status: 501 },
    );
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await getPortalUser(session.user.id);
  const email = user?.email ?? session.user.email ?? "";
  const name = user?.name || email;

  const jwt = await new SignJWT({
    scope: "user",
    name,
    email,
    external_id: session.user.id,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT", kid: keyId })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ jwt });
}

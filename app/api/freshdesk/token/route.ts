import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/auth";
import { getPortalUser } from "@/lib/portal";

// Signs a short-lived JWT that identifies the logged-in customer to the Freshdesk
// web chat widget (Admin → Channels → Web Chat → Widgets → Configure → User
// authentication). The widget passes it to fdWidget.init as jwtAuthToken.
// Returns 501 until the signing secret is configured, so the chat still works
// unauthenticated in the meantime.
export async function GET() {
  const secret = process.env.FRESHDESK_JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Freshdesk chat auth not configured" },
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
  const company = user?.client?.name ?? "";

  // Freshdesk identifies the contact by email; `exp` is mandatory. The company
  // rides along as a custom contact field (create it in Freshdesk with the
  // internal name below).
  const companyField = process.env.FRESHDESK_COMPANY_FIELD ?? "cf_company";

  const jwt = await new SignJWT({
    email,
    name,
    unique_external_id: session.user.id,
    ...(company ? { [companyField]: company } : {}),
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ jwt });
}

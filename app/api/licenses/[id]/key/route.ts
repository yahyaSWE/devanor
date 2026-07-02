import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { readUpload } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const license = await prisma.license.findUnique({
    where: { id },
    select: {
      clientId: true,
      keyStoredName: true,
      keyFileName: true,
      keyMimeType: true,
      keySize: true,
    },
  });
  if (!license || !license.keyStoredName) {
    return new Response("Not found", { status: 404 });
  }

  // Admins see everything; customers only their own company's license keys.
  if (session.user.role !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { clientId: true },
    });
    if (user?.clientId !== license.clientId) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  try {
    const buffer = await readUpload(license.keyStoredName);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": license.keyMimeType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          license.keyFileName ?? "license-key",
        )}"`,
        ...(license.keySize
          ? { "Content-Length": String(license.keySize) }
          : {}),
      },
    });
  } catch {
    return new Response("File missing", { status: 404 });
  }
}

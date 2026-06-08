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
  const download = await prisma.download.findUnique({ where: { id } });
  if (!download) return new Response("Not found", { status: 404 });

  // Access control: admins see everything; customers see global files
  // (clientId null) and files assigned to their own client.
  if (session.user.role !== "ADMIN" && download.clientId) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { clientId: true },
    });
    if (user?.clientId !== download.clientId) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  try {
    const buffer = await readUpload(download.storedName);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": download.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          download.fileName,
        )}"`,
        "Content-Length": String(download.size),
      },
    });
  } catch {
    return new Response("File missing", { status: 404 });
  }
}

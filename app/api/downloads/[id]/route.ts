import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { readUpload } from "@/lib/storage";
import { canSee } from "@/lib/portal";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const download = await prisma.download.findUnique({
    where: { id },
    include: {
      clients: { select: { id: true } },
      users: { select: { id: true } },
    },
  });
  if (!download) return new Response("Not found", { status: 404 });

  // Deactivated documents stay available to admins (for preview) only.
  if (session.user.role !== "ADMIN" && !download.active) {
    return new Response("Not found", { status: 404 });
  }

  // Access control: admins see everything; customers see files targeted at
  // nobody (all customers), at their company, or at them personally.
  if (session.user.role !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { clientId: true },
    });
    if (!canSee(download, user?.clientId ?? null, session.user.id)) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  // ?inline=1 renders the file in the browser (used by the admin preview
  // modal) instead of forcing a download.
  const inline = req.nextUrl.searchParams.get("inline") === "1";

  try {
    const buffer = await readUpload(download.storedName);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": download.mimeType,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(
          download.fileName,
        )}"`,
        "Content-Length": String(download.size),
      },
    });
  } catch {
    return new Response("File missing", { status: 404 });
  }
}

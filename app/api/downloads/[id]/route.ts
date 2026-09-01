import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { readUpload } from "@/lib/storage";
import { canSee } from "@/lib/portal";
import { isWordDownload } from "@/lib/download-preview";
import mammoth from "mammoth";

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
  const canManageContent =
    session.user.role === "ADMIN" || session.user.role === "SUPPORT";

  // Deactivated documents stay available to admins (for preview) only.
  if (!canManageContent && !download.active) {
    return new Response("Not found", { status: 404 });
  }

  // Access control: admins see everything; customers see files targeted at
  // nobody (all customers), at their company, or at them personally.
  if (!canManageContent) {
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
    if (inline && isWordDownload(download.mimeType, download.fileName)) {
      if (!download.fileName.toLowerCase().endsWith(".docx")) {
        return new Response("Preview is available for .docx Word files only.", {
          status: 415,
        });
      }
      const converted = await mammoth.convertToHtml({ buffer });
      const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{max-width:860px;margin:0 auto;padding:40px;font:16px/1.6 system-ui,sans-serif;color:#222;background:#fff}img{max-width:100%;height:auto}table{border-collapse:collapse;max-width:100%}td,th{border:1px solid #ccc;padding:6px}a{color:#765820}</style></head><body>${converted.value}</body></html>`;
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy":
            "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
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

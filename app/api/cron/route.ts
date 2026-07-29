import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";
import { formatDate } from "@/lib/format";

// Daily job (see vercel.json). Vercel Cron sends `Authorization: Bearer
// <CRON_SECRET>` automatically when CRON_SECRET is set.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);

  // 1. Auto-deactivate licenses that have passed their expiry date.
  const deactivated = await prisma.license.updateMany({
    where: {
      active: true,
      permanent: false,
      expiresAt: { not: null, lt: now },
    },
    data: { active: false, status: "EXPIRED" },
  });

  // 2. Warn info@devanor.com about upcoming expiries and due admin reminders,
  //    once per license (reminderSentAt guards against repeats).
  const due = await prisma.license.findMany({
    where: {
      reminderSentAt: null,
      OR: [
        {
          active: true,
          permanent: false,
          expiresAt: { not: null, gte: now, lte: soon },
        },
        { reminderAt: { not: null, lte: soon } },
      ],
    },
    include: { client: { select: { name: true } }, modules: true },
  });

  let emailed = 0;
  if (due.length > 0) {
    const items = due.map((l) => {
      const isReminder = l.permanent || !l.expiresAt;
      const date = formatDate(isReminder ? l.reminderAt : l.expiresAt);
      const modules = l.modules.map((m) => m.name).join(", ") || "—";
      return `<li>${l.client.name} — ${modules} — ${
        isReminder ? "reminder" : "expires"
      } ${date}</li>`;
    });
    const res = await sendEmail({
      to: "info@devanor.com",
      subject: `Devanor: ${due.length} license${
        due.length === 1 ? "" : "s"
      } need attention`,
      html: `<p>The following licenses are expiring soon or have a renewal reminder due:</p><ul>${items.join(
        "",
      )}</ul><p><a href="${appUrl()}/admin/licenses/expiring">Open in admin →</a></p>`,
    });
    if (res.ok) {
      emailed = due.length;
      await prisma.license.updateMany({
        where: { id: { in: due.map((l) => l.id) } },
        data: { reminderSentAt: now },
      });
    }
  }

  return Response.json({ deactivated: deactivated.count, emailed });
}

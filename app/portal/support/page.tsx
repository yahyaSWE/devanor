import { site } from "@/lib/site";
import { OpenChatButton } from "@/components/portal/OpenChatButton";
import { requireUser } from "@/lib/auth-helpers";
import { createTelegramLinkCode } from "@/lib/chatwoot";

export const metadata = { title: "Support" };

export default async function PortalSupportPage() {
  const session = await requireUser();
  const telegramCode = createTelegramLinkCode(session.user.id);
  const chatEnabled = true;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Support</h1>
        <p className="mt-2 text-muted">
          Chat with our helpdesk or reach us directly — we&apos;re here to help with
          any E3.Series question.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <h2 className="font-semibold">Live chat</h2>
        {chatEnabled ? (
          <>
            <p className="mt-1 text-sm text-muted">
              Our support chat is powered by Chatwoot. Click below or use the
              chat bubble in the corner.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <OpenChatButton enabled={chatEnabled} />
              {telegramCode && (
                <a
                  href={`https://t.me/devanorbot?start=${encodeURIComponent(telegramCode)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  Chat via Telegram
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">
            Live chat isn&apos;t configured yet. In the meantime, use the contact
            details below.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface/40 p-6">
        <h2 className="font-semibold">Contact us</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted">Email</p>
            <a href={site.contact.emailHref} className="transition-colors hover:text-accent">
              {site.contact.email}
            </a>
          </div>
          <div>
            <p className="text-muted">Phone</p>
            <a href={site.contact.phoneHref} className="transition-colors hover:text-accent">
              {site.contact.phone}
            </a>
          </div>
          <div>
            <p className="text-muted">WhatsApp</p>
            <a href={site.contact.whatsappHref} className="transition-colors hover:text-accent">
              {site.contact.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

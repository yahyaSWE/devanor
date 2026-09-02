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
              Chat with us using the chat bubble or connect your Telegram account.
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
            <p className="mt-4 text-sm text-muted">
              If you experience any issues with the support chat, contact us at{" "}
              <a
                href={site.contact.emailHref}
                className="text-accent transition-colors hover:underline"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">
            Live chat isn&apos;t configured yet. In the meantime, use the contact
            details below.
          </p>
        )}
      </section>

    </div>
  );
}

import { site } from "@/lib/site";
import { OpenChatButton } from "@/components/portal/OpenChatButton";

export const metadata = { title: "Support" };

export default function PortalSupportPage() {
  const chatEnabled = Boolean(process.env.NEXT_PUBLIC_ZENDESK_KEY);

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
              Our support chat is powered by Zendesk. Click below or use the chat
              bubble in the corner.
            </p>
            <div className="mt-4">
              <OpenChatButton enabled={chatEnabled} />
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">
            Live chat isn&apos;t configured yet. Set{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_ZENDESK_KEY
            </code>{" "}
            to enable the Zendesk widget. In the meantime, use the contact details
            below.
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

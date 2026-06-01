"use client";

import { useActionState } from "react";
import { submitDemo, type DemoFormState } from "@/lib/actions/demo";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";

const initialState: DemoFormState = {};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent/60";

export default function BookDemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemo, initialState);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-28 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Book a Demo
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
          Let&apos;s talk about your design workflow
        </h1>
        <p className="mt-5 text-lg text-muted">
          Tell us a little about your team and what you&apos;re working on. We&apos;ll
          get back to you to arrange a tailored demo of E3.Series.
        </p>

        <dl className="mt-10 space-y-4 text-sm">
          <div>
            <dt className="text-muted">Phone</dt>
            <dd>
              <a href={site.contact.phoneHref} className="hover:text-accent">
                {site.contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted">WhatsApp</dt>
            <dd>
              <a href={site.contact.whatsappHref} className="hover:text-accent">
                {site.contact.whatsapp}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Address</dt>
            <dd>{site.contact.address}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 p-8">
        {state.ok ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-[#04110d] text-xl font-bold">
              ✓
            </div>
            <h2 className="mt-4 text-xl font-semibold">Thank you!</h2>
            <p className="mt-2 text-muted">
              We&apos;ve received your request and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
                Name *
              </label>
              <input id="name" name="name" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="company" className="mb-1.5 block text-sm text-muted">
                Company
              </label>
              <input id="company" name="company" className={inputClass} />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
                What would you like to see?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className={inputClass}
              />
            </div>

            {state.error && <p className="text-sm text-red-400">{state.error}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending…" : "Request demo"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

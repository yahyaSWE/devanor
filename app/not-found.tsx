import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </div>
  );
}

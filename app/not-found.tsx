import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-cream-soft px-5 text-center text-ink">
      <p className="mb-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink/45">
        404
      </p>
      <h1 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
        This page is not on the plan.
      </h1>
      <p className="mt-5 max-w-md font-tagline text-base font-light leading-relaxed text-ink/65">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-full bg-terracotta px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream"
      >
        Back to home
      </Link>
    </section>
  );
}

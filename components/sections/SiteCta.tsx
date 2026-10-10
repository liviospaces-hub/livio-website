import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact";

/** Full-width CTA band above the footer — content constrained to container */
export function SiteCta() {
  return (
    <section
      id="site-cta"
      className="relative w-full overflow-hidden bg-cream-soft text-ink"
      aria-label="Start a project"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-terracotta/10 to-transparent"
      />

      <div className="container relative py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink/45">
              <span aria-hidden className="text-[0.65em]">
                ✦
              </span>
              Next step
            </p>
            <h2 className="font-display text-[clamp(1.85rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
              Ready to shape a space that feels like yours?
            </h2>
            <p className="mt-4 max-w-lg font-tagline text-base font-light leading-relaxed text-ink/65 sm:text-lg">
              Tell us about your site, brief, or idea — we typically respond
              within a few days.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-terracotta px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream shadow-[0_4px_20px_rgba(168,83,46,0.3)] transition-shadow hover:shadow-[0_6px_28px_rgba(168,83,46,0.4)]"
            >
              Start a project
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WORKS, WORK_CATEGORIES, type Work } from "@/data/works";
import { cn } from "@/lib/utils";

/**
 * Editorial portfolio layout for /work — scannable, shareable, no scroll-jacking.
 * Homepage cinematic Works section stays separate.
 */
export function WorkPortfolio() {
  const [filter, setFilter] = useState("All");

  const projects = useMemo(
    () =>
      filter === "All" ? WORKS : WORKS.filter((w) => w.category === filter),
    [filter]
  );

  return (
    <div className="bg-cream-soft text-ink">
      {/* Sticky filter bar */}
      <div className="sticky top-[4.5rem] z-20 border-b border-ink/10 bg-cream-soft/90 backdrop-blur-md sm:top-[5rem]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink/45">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
          <div
            className="flex flex-wrap gap-1"
            role="tablist"
            aria-label="Filter projects"
          >
            {WORK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] transition-colors",
                  filter === cat
                    ? "bg-ink text-cream-soft"
                    : "text-ink/50 hover:bg-ink/5 hover:text-ink"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project list — full-bleed editorial rows */}
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <ul className="divide-y divide-ink/10">
          {projects.map((work, index) => (
            <PortfolioRow
              key={work.id}
              work={work}
              reverse={index % 2 === 1}
            />
          ))}
        </ul>

        {projects.length === 0 ? (
          <p className="py-24 text-center font-tagline text-lg text-ink/50">
            No projects in this category yet.
          </p>
        ) : null}
      </div>

      {/* Share / CTA band */}
      <section
        className="mt-6 border-t border-ink/10 bg-terracotta text-cream-soft"
        aria-label="Start a project"
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-20 lg:px-12">
          <div className="max-w-xl">
            <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream-soft/55">
              Portfolio
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
              Looking for a space shaped with the same care?
            </h2>
            <p className="mt-4 font-tagline text-base font-light leading-relaxed text-cream-soft/75 sm:text-lg">
              Share this page with your team, or tell us about your site and
              brief — we typically respond within a few days.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cream-soft px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-90"
            >
              Start a project
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({
                    title: "Livio Spaces — Work",
                    text: "Selected projects by Livio Spaces",
                    url: window.location.href,
                  });
                } else if (typeof navigator !== "undefined") {
                  void navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-cream-soft/35 px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-soft transition-colors hover:border-cream-soft/70"
            >
              Share portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PortfolioRow({
  work,
  reverse,
}: {
  work: Work;
  reverse: boolean;
}) {
  return (
    <li id={work.id} className="scroll-mt-28 py-12 sm:py-16 lg:py-20">
      <Link
        href={`/work/${work.id}`}
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
      >
        <article
          className={cn(
            "grid items-center gap-8 lg:grid-cols-12 lg:gap-12",
            reverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 lg:col-span-7 lg:aspect-[16/11]">
            <Image
              src={work.image}
              alt={`${work.title} — ${work.location}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
                {work.number}
              </span>
              {work.year ? (
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
                  {work.year}
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 font-display text-[clamp(1.85rem,4vw,2.85rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink transition-colors group-hover:text-terracotta">
              {work.title}
            </h2>

            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
              {work.category}
              <span className="mx-2 text-ink/25" aria-hidden>
                ·
              </span>
              {work.location}
            </p>

            <p className="mt-6 max-w-md font-tagline text-base font-light leading-relaxed text-ink/70 sm:text-[1.05rem]">
              {work.description}
            </p>

            <span className="mt-8 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-terracotta">
              View project
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </article>
      </Link>
    </li>
  );
}

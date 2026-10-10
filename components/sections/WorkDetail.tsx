"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { type Work } from "@/data/works";

type WorkDetailProps = {
  work: Work;
  prev: Work;
  next: Work;
  index: number;
  total: number;
};

export function WorkDetail({
  work,
  prev,
  next,
  index,
  total,
}: WorkDetailProps) {
  const router = useRouter();
  const gallery = work.images?.length ? work.images : [work.image];

  const goPrev = useCallback(() => {
    router.push(`/work/${prev.id}`);
  }, [router, prev.id]);

  const goNext = useCallback(() => {
    router.push(`/work/${next.id}`);
  }, [router, next.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <div className="bg-cream-soft text-ink">
      {/* Top bar */}
      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 pt-28 sm:px-8 sm:pt-32 lg:px-12">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All projects
          </Link>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/40">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Intro */}
      <header className="mx-auto max-w-[1600px] px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-14 lg:px-12">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
            {work.number}
          </span>
          {work.year ? (
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
              {work.year}
            </span>
          ) : null}
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
          {work.title}
        </h1>
        <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
          {work.category}
          <span className="mx-2 text-ink/25" aria-hidden>
            ·
          </span>
          {work.location}
        </p>
        <p className="mt-6 max-w-2xl font-tagline text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          {work.description}
        </p>
      </header>

      {/* Gallery */}
      <section
        className="mx-auto max-w-[1600px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12"
        aria-label={`${work.title} gallery`}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Lead image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5 sm:aspect-[21/10]">
            <Image
              src={gallery[0]}
              alt={`${work.title} — view 1`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Remaining images — staggered grid */}
          {gallery.length > 1 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {gallery.slice(1).map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={`relative overflow-hidden bg-ink/5 ${
                    i === gallery.length - 2 && gallery.length % 2 === 0
                      ? "aspect-[4/3] sm:col-span-2 sm:aspect-[21/9]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${work.title} — view ${i + 2}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Project → project nav */}
      <nav
        className="sticky bottom-0 z-30 border-t border-ink/10 bg-cream-soft/95 backdrop-blur-md"
        aria-label="Project navigation"
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-ink/10 sm:grid-cols-[1fr_auto_1fr]">
          <Link
            href={`/work/${prev.id}`}
            className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-ink/[0.03] sm:px-8 lg:px-12"
          >
            <ArrowLeft
              size={16}
              className="shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-ink"
            />
            <span className="min-w-0 text-left">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/40">
                Previous
              </span>
              <span className="mt-0.5 block truncate font-display text-sm font-semibold tracking-[-0.02em] text-ink sm:text-base">
                {prev.title}
              </span>
            </span>
          </Link>

          <div className="hidden items-center justify-center px-6 sm:flex">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-terracotta transition-colors hover:text-terracotta-deep"
            >
              Inquire
              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <Link
            href={`/work/${next.id}`}
            className="group flex items-center justify-end gap-3 px-5 py-4 transition-colors hover:bg-ink/[0.03] sm:px-8 lg:px-12"
          >
            <span className="min-w-0 text-right">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/40">
                Next
              </span>
              <span className="mt-0.5 block truncate font-display text-sm font-semibold tracking-[-0.02em] text-ink sm:text-base">
                {next.title}
              </span>
            </span>
            <ArrowRight
              size={16}
              className="shrink-0 text-ink/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink"
            />
          </Link>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import {
  gsap,
  ScrollTrigger,
  scheduleScrollRefresh,
  stableViewportHeight,
} from "@/lib/gsap";

const TITLE = "ALL PROJECTS";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-project-letter]")
      );
      const spaces = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-project-space]")
      );
      const arrow = pin.querySelector("[data-project-arrow]");
      const rule = pin.querySelector("[data-project-rule]");
      const hint = pin.querySelector("[data-project-hint]");

      gsap.set(letters, { yPercent: 120, opacity: 0, rotateX: -70 });
      gsap.set(spaces, { opacity: 0 });
      gsap.set(arrow, { x: -80, opacity: 0, scale: 0.6 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(hint, { opacity: 0, y: 24 });

      const titleTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          // Enough pin distance for full letter reveal + a short hold
          end: () => `+=${stableViewportHeight() * 1.15}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          id: "livio-projects-title",
        },
      });

      titleTl
        // Reveal all letters before anything else finishes
        .to(
          letters,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.05,
          },
          0
        )
        .to(spaces, { opacity: 1, duration: 0.2 }, 0.2)
        .to(arrow, { x: 0, opacity: 1, scale: 1, duration: 0.35 }, 0.45)
        .to(rule, { scaleX: 1, duration: 0.3 }, 0.55)
        .to(hint, { opacity: 1, y: 0, duration: 0.25 }, 0.65)
        // Hold on fully revealed title, then unpin → next section
        .to({}, { duration: 0.4 });
    }, section);

    const raf = requestAnimationFrame(() => scheduleScrollRefresh());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-projects-title")?.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-[13] bg-white text-black"
      aria-label="All projects"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-lvh items-center bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto w-full max-w-[1600px] bg-white">
          <Link
            href="/work"
            className="group flex flex-col gap-6 bg-white sm:gap-8"
            aria-label="View all projects"
          >
            <div
              className="flex w-full min-w-0 flex-col gap-6 bg-white sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
              style={{ perspective: 900 }}
            >
              <h2 className="min-w-0 max-w-full font-display text-[clamp(2.5rem,10.5vw,8rem)] font-bold uppercase leading-[0.85] tracking-[-0.05em] text-black">
                {TITLE.split("").map((char, i) =>
                  char === " " ? (
                    <span
                      key={`space-${i}`}
                      data-project-space
                      className="inline-block w-[0.28em]"
                    >
                      {"\u00A0"}
                    </span>
                  ) : (
                    <span
                      key={`${char}-${i}`}
                      className="inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-project-letter
                        className="inline-block origin-bottom will-change-transform"
                      >
                        {char}
                      </span>
                    </span>
                  )
                )}
              </h2>

              <span
                data-project-arrow
                aria-hidden
                className="inline-flex shrink-0 self-start text-black transition-transform duration-500 group-hover:translate-x-3 lg:self-center"
              >
                <svg
                  viewBox="0 0 120 48"
                  className="h-10 w-24 sm:h-14 sm:w-36 lg:h-[4.5rem] lg:w-44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 24h100M78 6l34 18-34 18"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <div
              data-project-rule
              className="h-px w-full origin-left bg-black/15"
            />

            <p
              data-project-hint
              className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-black/45 sm:text-xs"
            >
              Architecture · Interiors · Design
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

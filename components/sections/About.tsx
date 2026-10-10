"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, scheduleScrollRefresh } from "@/lib/gsap";

const INTRO_LINES = [
  "We bring architecture to life",
  "through craft and innovation.",
  "Trusted by architects who demand precision, beauty, and care.",
];

const PRIMARY_BROWN = "#a8532e";

/** About Livio — compact statement; black copy fills brown line-by-line on scroll */
export function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    if (!section || !intro) return;

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);
    window.addEventListener("livio:scroll-unlock", refresh);

    const ctx = gsap.context(() => {
      const introLines = gsap.utils.toArray<HTMLElement>(
        intro.querySelectorAll("[data-about-line]")
      );

      // Visible black by default; fill to primary brown L→R per line
      introLines.forEach((line) => {
        gsap.set(line, {
          color: "transparent",
          backgroundImage: `linear-gradient(90deg, ${PRIMARY_BROWN} 0%, ${PRIMARY_BROWN} 50%, #0a0a0a 50%, #0a0a0a 100%)`,
          backgroundSize: "200% 100%",
          backgroundPosition: "100% 0%",
          backgroundRepeat: "no-repeat",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        });
      });

      const introTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 35%",
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 7,
          id: "livio-about-intro",
        },
      });

      introTl.to(
        introLines,
        {
          backgroundPosition: "0% 0%",
          duration: 0.55,
          stagger: 0.18,
        },
        0
      );
    }, section);

    const raf = requestAnimationFrame(() => scheduleScrollRefresh());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      window.removeEventListener("livio:scroll-unlock", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-about-intro")?.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-[17] bg-white text-black"
      aria-label="About Livio"
    >
      <div
        ref={introRef}
        className="relative flex items-center justify-center bg-white px-6 py-16 sm:px-10 sm:py-20 md:py-24"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center bg-white text-center">
          <p
            data-about-label
            className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-black sm:mb-8 sm:text-xs"
          >
            <span aria-hidden className="text-[0.65em]">
              ✦
            </span>
            About Livio
          </p>

          <h2 className="font-display text-[1.65rem] font-bold leading-[1.15] tracking-[-0.03em] text-black sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {INTRO_LINES.map((line) => (
              <span key={line} className="block pb-[0.12em]">
                <span
                  data-about-line
                  className="block will-change-[background-position]"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <Link
            href="/about#clarity"
            data-about-cta
            className="mt-8 inline-flex items-center gap-2.5 bg-black px-5 py-3.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800 sm:mt-10 sm:text-xs"
          >
            <span aria-hidden className="text-sm leading-none">
              ↳
            </span>
            Who we are
          </Link>
        </div>
      </div>
    </section>
  );
}

const CLARITY_LINES = [
  { text: "Systematic", className: "block" },
  { text: "Clarity & Creativity", className: "block" },
];

const COLUMNS = [
  "Thoughtful architecture rooted in site, light, and proportion — residences and workplaces designed to feel calm, enduring, and distinctly human.",
  "Interior and spatial design that balances material richness with everyday ease — from early concept through detailing, finishes, and final form.",
];

/** Systematic Clarity & Creativity — compact scroll-in text */
export function AboutClarity() {
  const sectionRef = useRef<HTMLElement>(null);
  const clarityRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const clarity = clarityRef.current;
    if (!section || !clarity) return;

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);

    const ctx = gsap.context(() => {
      const clarityTitleWords = gsap.utils.toArray<HTMLElement>(
        clarity.querySelectorAll("[data-clarity-word]")
      );
      const clarityLines = gsap.utils.toArray<HTMLElement>(
        clarity.querySelectorAll("[data-clarity-line]")
      );
      const clarityCols = gsap.utils.toArray<HTMLElement>(
        clarity.querySelectorAll("[data-clarity-col]")
      );
      const clarityColWords = gsap.utils.toArray<HTMLElement>(
        clarity.querySelectorAll("[data-clarity-col-word]")
      );

      gsap.set(clarityLines, { yPercent: 115 });
      gsap.set(clarityTitleWords, { opacity: 0, y: 28, rotateX: -40 });
      gsap.set(clarityCols, { opacity: 0, y: 28 });
      gsap.set(clarityColWords, { opacity: 0, y: 8 });

      const clarityTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 40%",
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 5,
          id: "livio-clarity",
        },
      });

      clarityTl
        .to(clarityLines, { yPercent: 0, duration: 0.45, stagger: 0.12 }, 0)
        .to(
          clarityTitleWords,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.4,
            stagger: 0.05,
          },
          0.04
        )
        .to(
          clarityCols,
          { opacity: 1, y: 0, duration: 0.28, stagger: 0.1 },
          0.32
        )
        .to(
          clarityColWords,
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.015 },
          0.36
        );
    }, section);

    const raf = requestAnimationFrame(() => scheduleScrollRefresh());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-clarity")?.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clarity"
      className="relative z-[15] bg-white text-black"
      aria-label="Systematic Clarity and Creativity"
    >
      <div
        ref={clarityRef}
        className="relative flex min-h-[70svh] items-center justify-center bg-white px-6 py-16 sm:px-10 sm:py-20"
      >
        <div className="mx-auto w-full max-w-5xl bg-white text-center">
          <h2
            className="font-display text-[2.75rem] font-bold leading-[0.95] tracking-[-0.04em] text-black sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={{ perspective: 800 }}
          >
            {CLARITY_LINES.map((line) => (
              <span
                key={line.text}
                className="block overflow-hidden pb-[0.08em]"
              >
                <span
                  data-clarity-line
                  className={`block will-change-transform ${line.className}`}
                >
                  {line.text.split(" ").map((word, i, arr) => (
                    <span
                      key={`${line.text}-${word}-${i}`}
                      data-clarity-word
                      className={`inline-block origin-bottom will-change-[opacity,transform]${
                        word === "Creativity" ? " creativity-gradient" : ""
                      }`}
                      style={{
                        fontSize: word === "&" ? "0.82em" : undefined,
                        verticalAlign: word === "&" ? "baseline" : undefined,
                      }}
                    >
                      {word}
                      {i < arr.length - 1 ? "\u00A0" : ""}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h2>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 bg-white text-left sm:mt-10 sm:grid-cols-2 sm:gap-12 md:gap-16">
            {COLUMNS.map((copy, colIndex) => (
              <p
                key={copy}
                data-clarity-col
                className={`text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem] ${
                  colIndex === 0 ? "sm:pr-4" : "sm:pl-4"
                }`}
              >
                {copy.split(" ").map((word, i, arr) => (
                  <span
                    key={`${colIndex}-${word}-${i}`}
                    data-clarity-col-word
                    className="inline-block will-change-[opacity,transform]"
                  >
                    {word}
                    {i < arr.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Prefer AboutIntro + AboutClarity for section order control */
export function About() {
  return (
    <>
      <AboutIntro />
      <AboutClarity />
    </>
  );
}

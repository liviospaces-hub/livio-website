"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, scheduleScrollRefresh, stableViewportHeight } from "@/lib/gsap";
import { WORKS } from "@/data/works";

/**
 * Cinematic handoff recipes — each project-to-project cut uses a different
 * mask + parallax pair so the scrub never feels like a plain crossfade.
 */
type HandoffKind =
  | "rise"
  | "slide"
  | "iris"
  | "diagonal"
  | "curtain"
  | "zoomBleed";

const HANDOFFS: HandoffKind[] = [
  "rise",
  "slide",
  "iris",
  "diagonal",
  "curtain",
  "zoomBleed",
];

const CLIP = {
  full: "inset(0% 0% 0% 0%)",
  hiddenBottom: "inset(100% 0% 0% 0%)",
  hiddenLeft: "inset(0% 0% 0% 100%)",
  hiddenRight: "inset(0% 100% 0% 0%)",
  curtain: "inset(50% 0% 50% 0%)",
  irisClosed: "circle(0% at 50% 55%)",
  irisOpen: "circle(160% at 50% 55%)",
  diagClosed: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  diagOpen: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  diagSlashClosed: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  diagSlashOpen: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
} as const;

function playHandoff(
  tl: gsap.core.Timeline,
  kind: HandoffKind,
  fromFrame: HTMLElement,
  toFrame: HTMLElement,
  fromImg: HTMLElement,
  toImg: HTMLElement,
  flash: HTMLElement | null,
  at: number,
  dur: number,
  zBoost: number
) {
  // Incoming always on top during the cut
  gsap.set(toFrame, {
    zIndex: zBoost,
    autoAlpha: 1,
    force3D: true,
  });
  gsap.set(fromFrame, { force3D: true });

  // Soft light/dark flash mid-cut — cinematic “shutter”
  if (flash) {
    tl.fromTo(
      flash,
      { autoAlpha: 0 },
      { autoAlpha: 0.22, duration: dur * 0.22 },
      at
    );
    tl.to(flash, { autoAlpha: 0, duration: dur * 0.45 }, at + dur * 0.28);
  }

  switch (kind) {
    case "rise": {
      // Architecture rising — wipe from ground + opposing parallax
      tl.fromTo(
        toFrame,
        { clipPath: CLIP.hiddenBottom },
        { clipPath: CLIP.full, duration: dur },
        at
      );
      tl.fromTo(
        toImg,
        { yPercent: 18, scale: 1.28 },
        { yPercent: 0, scale: 1, duration: dur },
        at
      );
      tl.to(
        fromImg,
        { yPercent: -10, scale: 1.12, duration: dur },
        at
      );
      tl.to(fromFrame, { autoAlpha: 0.25, duration: dur * 0.9 }, at + dur * 0.1);
      break;
    }
    case "slide": {
      // Lateral reveal with counter-drift on the outgoing plate
      tl.fromTo(
        toFrame,
        { clipPath: CLIP.hiddenLeft },
        { clipPath: CLIP.full, duration: dur },
        at
      );
      tl.fromTo(
        toImg,
        { xPercent: 22, scale: 1.18 },
        { xPercent: 0, scale: 1, duration: dur },
        at
      );
      tl.to(
        fromImg,
        { xPercent: -14, scale: 1.08, duration: dur },
        at
      );
      tl.to(fromFrame, { autoAlpha: 0.2, duration: dur * 0.85 }, at + dur * 0.15);
      break;
    }
    case "iris": {
      // Aperture open — circle expands from optical center
      tl.fromTo(
        toFrame,
        { clipPath: CLIP.irisClosed },
        { clipPath: CLIP.irisOpen, duration: dur },
        at
      );
      tl.fromTo(
        toImg,
        { scale: 1.35 },
        { scale: 1, duration: dur },
        at
      );
      tl.to(fromImg, { scale: 1.18, duration: dur }, at);
      tl.to(fromFrame, { autoAlpha: 0, duration: dur * 0.7 }, at + dur * 0.25);
      break;
    }
    case "diagonal": {
      // Oblique polygon wipe — editorial / print feel
      tl.fromTo(
        toFrame,
        { clipPath: CLIP.diagSlashClosed },
        { clipPath: CLIP.diagSlashOpen, duration: dur },
        at
      );
      tl.fromTo(
        toImg,
        { scale: 1.22, xPercent: 8, yPercent: -6 },
        { scale: 1, xPercent: 0, yPercent: 0, duration: dur },
        at
      );
      tl.to(
        fromImg,
        { scale: 1.1, xPercent: -6, yPercent: 4, duration: dur },
        at
      );
      tl.to(fromFrame, { autoAlpha: 0.15, duration: dur * 0.8 }, at + dur * 0.2);
      break;
    }
    case "curtain": {
      // Center split opens like a stage curtain
      tl.fromTo(
        toFrame,
        { clipPath: CLIP.curtain },
        { clipPath: CLIP.full, duration: dur },
        at
      );
      tl.fromTo(
        toImg,
        { scaleY: 1.35, scaleX: 1.05 },
        { scaleY: 1, scaleX: 1, duration: dur },
        at
      );
      tl.to(fromImg, { scale: 1.14, duration: dur }, at);
      tl.to(fromFrame, { autoAlpha: 0.2, duration: dur * 0.75 }, at + dur * 0.2);
      break;
    }
    case "zoomBleed": {
      // Push through — outgoing blooms, incoming settles from overscale
      tl.set(toFrame, { clipPath: CLIP.full });
      tl.fromTo(
        toFrame,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: dur * 0.55 },
        at + dur * 0.15
      );
      tl.fromTo(
        toImg,
        { scale: 1.45 },
        { scale: 1, duration: dur },
        at
      );
      tl.to(
        fromImg,
        { scale: 1.55, duration: dur },
        at
      );
      tl.to(
        fromFrame,
        { autoAlpha: 0, duration: dur * 0.65 },
        at + dur * 0.2
      );
      break;
    }
  }

  // Settle outgoing fully off after the cut completes
  tl.set(fromFrame, { autoAlpha: 0, clipPath: CLIP.full }, at + dur);
  tl.set(fromImg, { xPercent: 0, yPercent: 0, scale: 1 }, at + dur);
  tl.set(toFrame, { clipPath: CLIP.full, autoAlpha: 1 }, at + dur);
  tl.set(toImg, { xPercent: 0, yPercent: 0, scale: 1 }, at + dur);
}
export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);
    window.addEventListener("livio:scroll-unlock", refresh);

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-work-frame]")
      );
      const imgs = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-work-img]")
      );
      const panels = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-work-panel]")
      );
      const progressFill = pin.querySelector<HTMLElement>(
        "[data-work-progress-fill]"
      );
      const headerBits = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-work-header]")
      );
      const counter = pin.querySelector<HTMLElement>("[data-work-counter]");

      const flash = pin.querySelector<HTMLElement>("[data-work-flash]");
      const stage = pin.querySelector<HTMLElement>("[data-work-stage]");

      frames.forEach((frame, i) => {
        gsap.set(frame, {
          zIndex: i === 0 ? 10 : 1,
          autoAlpha: i === 0 ? 1 : 0,
          clipPath: CLIP.full,
          force3D: true,
        });
      });
      imgs.forEach((img) => {
        gsap.set(img, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          force3D: true,
          transformOrigin: "50% 50%",
        });
      });
      if (flash) gsap.set(flash, { autoAlpha: 0 });

      gsap.set(panels, { autoAlpha: 0, y: 28 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      gsap.set(headerBits, { autoAlpha: 0, y: 18 });
      gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });
      if (counter) counter.textContent = WORKS[0].number;

      const setActive = (index: number) => {
        const i = Math.max(0, Math.min(WORKS.length - 1, index));
        if (counter) counter.textContent = WORKS[i].number;
      };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 40%",
            scrub: true,
          },
        })
        .to(headerBits, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1 }, 0);

      // Hold rests on a project; cut is the cinematic handoff
      const hold = 0.7;
      const cut = 0.45;
      const unit = hold + cut;
      const totalUnits = hold + (WORKS.length - 1) * unit;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${stableViewportHeight() * Math.max(4.5, WORKS.length * 1.05)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          id: "livio-works",
          onUpdate: (self) => {
            const raw = self.progress * totalUnits;
            let idx = 0;
            if (raw > hold) {
              idx = Math.min(
                WORKS.length - 1,
                1 + Math.floor((raw - hold) / unit)
              );
            }
            setActive(idx);
            if (progressFill) gsap.set(progressFill, { scaleX: self.progress });
          },
        },
      });

      if (stage) {
        tl.fromTo(
          stage,
          { scale: 1 },
          { scale: 1.02, duration: totalUnits, ease: "none" },
          0
        );
      }

      tl.addLabel("work-0", 0);
      tl.to({}, { duration: hold }, 0);

      WORKS.forEach((_, i) => {
        if (i === 0) return;
        const at = hold + (i - 1) * unit;
        const kind = HANDOFFS[(i - 1) % HANDOFFS.length];

        playHandoff(
          tl,
          kind,
          frames[i - 1],
          frames[i],
          imgs[i - 1],
          imgs[i],
          flash,
          at,
          cut,
          20 + i
        );

        tl.to(
          panels[i - 1],
          { autoAlpha: 0, y: -22, duration: cut * 0.4 },
          at
        );
        tl.fromTo(
          panels[i],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: cut * 0.55 },
          at + cut * 0.28
        );

        tl.addLabel(`work-${i}`, at + cut);
        tl.to({}, { duration: hold }, at + cut);
      });
    }, section);

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      window.removeEventListener("livio:scroll-unlock", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-works")?.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-[12] bg-black text-cream-soft"
      aria-label="Selected works"
    >
      <div
        ref={pinRef}
        className="relative z-[12] flex min-h-lvh flex-col overflow-hidden bg-black lg:flex-row"
      >
        <div
          className="absolute left-0 right-0 top-0 z-40 h-[2px] bg-cream-soft/10"
          aria-hidden
        >
          <div
            data-work-progress-fill
            className="h-full w-full origin-left scale-x-0 bg-cream-soft"
          />
        </div>

        {/* Visual — dominant on dark */}
        <div
          data-work-stage
          className="relative order-1 h-[50svh] w-full shrink-0 overflow-hidden sm:h-[56svh] lg:order-1 lg:h-lvh lg:w-[60%]"
        >
          {WORKS.map((work, i) => (
            <div
              key={work.id}
              data-work-frame
              className="absolute inset-0 overflow-hidden will-change-[clip-path,transform,opacity]"
            >
              <div
                data-work-img
                className="absolute inset-[-8%] will-change-transform"
              >
                <Image
                  src={work.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          {/* Shutter flash between cinematic cuts */}
          <div
            data-work-flash
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-cream-soft mix-blend-overlay"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-black/30 lg:bg-gradient-to-r lg:from-black/50 lg:via-transparent lg:to-transparent"
          />

          <span
            data-work-counter
            aria-hidden
            className="pointer-events-none absolute left-4 top-4 z-30 font-mono text-[0.65rem] tracking-[0.2em] text-cream-soft/50 lg:left-8 lg:top-8"
          >
            01
          </span>
        </div>

        {/* Copy column */}
        <div className="relative order-2 flex flex-1 flex-col justify-center gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:w-[40%] lg:gap-14 lg:px-12 lg:py-16 xl:px-14">
          <header className="max-w-md shrink-0">
            <p
              data-work-header
              className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-cream-soft/45 sm:mb-4"
            >
              <span aria-hidden className="text-[0.65em]">
                ✦
              </span>
              Selected Works
            </p>
            <h2
              data-work-header
              className="font-display text-[1.85rem] font-bold leading-[1.05] tracking-[-0.035em] text-cream-soft sm:text-3xl lg:text-[2.5rem]"
            >
              Spaces we shaped.
              <span className="mt-1 block text-cream-soft/35">
                Still living in them.
              </span>
            </h2>
          </header>

          <div className="grid w-full max-w-md">
            {WORKS.map((work) => (
              <article
                key={work.id}
                data-work-panel
                className="col-start-1 row-start-1 flex flex-col justify-center will-change-transform"
              >
                <h3 className="font-display text-[1.7rem] font-bold leading-[1.1] tracking-[-0.03em] text-cream-soft sm:text-3xl lg:text-[2.25rem]">
                  {work.title}
                </h3>
                <Link
                  href={`/work/${work.id}`}
                  className="group mt-5 inline-flex w-fit items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-soft/80 transition-colors hover:text-cream-soft sm:mt-6"
                >
                  View project
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = document.getElementById("site-cta");
            const st = ScrollTrigger.getById("livio-works");
            const top = next
              ? next.getBoundingClientRect().top + window.scrollY
              : (st?.end ?? window.scrollY + window.innerHeight);

            const anim = st?.animation;
            if (anim) {
              const frozen = anim.totalProgress();
              const totalProgress = anim.totalProgress.bind(anim);
              const progress = anim.progress.bind(anim);
              anim.totalProgress = ((value?: number) => {
                if (typeof value === "number") return totalProgress(frozen, true);
                return frozen;
              }) as typeof anim.totalProgress;
              anim.progress = ((value?: number) => {
                if (typeof value === "number") return progress(frozen, true);
                return frozen;
              }) as typeof anim.progress;
              window.setTimeout(() => {
                anim.totalProgress = totalProgress;
                anim.progress = progress;
              }, 1500);
            }

            window.dispatchEvent(
              new CustomEvent("livio:scroll-glide", { detail: top })
            );
          }}
          className="absolute bottom-4 right-4 z-50 rounded-full border border-cream-soft/30 bg-black/55 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-cream-soft/75 backdrop-blur-sm transition-colors hover:text-cream-soft sm:bottom-5 sm:right-5 sm:text-[0.62rem]"
        >
          Skip
        </button>
      </div>
    </section>
  );
}

export default Works;

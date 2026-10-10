"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, didViewportWidthChange, invalidateStableViewport, scheduleScrollRefresh, stableViewportHeight } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import {
  SCROLL_FRAME_STAGES,
  SCROLL_FRAME_TOTAL,
  scrollFrameSrc,
  type ScrollFrameStage,
} from "@/components/scroll-frame/stages";

type ScrollFrameSectionProps = {
  scrollHeightVh?: number;
  mobileScrollHeightVh?: number;
  className?: string;
  stages?: ScrollFrameStage[];
};

/**
 * Frame-mapping: progress [0,1] → frameIndex0 = round(progress * (TOTAL - 1))
 * Stage-range: first stage where progress ∈ [from, to) (last includes to === 1)
 * Label in/out: scrubbed in progress-space so motion stays scroll-locked.
 */
export function ScrollFrameSection({
  scrollHeightVh = 420,
  mobileScrollHeightVh = 180,
  className = "",
  stages = SCROLL_FRAME_STAGES,
}: ScrollFrameSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const labelsRoot = labelsRef.current;
    const dotsRoot = dotsRef.current;
    const meter = meterRef.current;
    const counter = counterRef.current;
    const copyCol = copyColRef.current;
    if (
      !section ||
      !pin ||
      !canvas ||
      !labelsRoot ||
      !dotsRoot ||
      !meter ||
      !counter ||
      !copyCol
    )
      return;

    const ctx2d = canvas.getContext("2d", { alpha: false });
    if (!ctx2d) return;

    let disposed = false;
    let frames: (HTMLImageElement | null)[] = new Array(SCROLL_FRAME_TOTAL).fill(
      null
    );
    let currentFrame = -1;
    let pendingProgress = 0;
    let rafDrawId = 0;
    let drawScheduled = false;
    let lastStage = -1;

    const labelEls = gsap.utils.toArray<HTMLElement>(
      labelsRoot.querySelectorAll("[data-stage-label]")
    );
    const dotEls = gsap.utils.toArray<HTMLElement>(
      dotsRoot.querySelectorAll("[data-stage-dot]")
    );
    const eyebrow = copyCol.querySelector<HTMLElement>("[data-build-eyebrow]");
    const meterFill = meter.querySelector<HTMLElement>("[data-build-meter-fill]");

    gsap.set(labelEls, { autoAlpha: 0, y: 24 });
    labelEls.forEach((el) => {
      gsap.set(el.querySelector("[data-stage-num]"), { autoAlpha: 0, y: 12 });
      gsap.set(el.querySelector("[data-stage-rule]"), {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(el.querySelector("[data-stage-title]"), { autoAlpha: 0, y: 28 });
      gsap.set(el.querySelector("[data-stage-sub]"), { autoAlpha: 0, y: 14 });
    });
    gsap.set(eyebrow, { autoAlpha: 0, y: 10 });
    gsap.set(meterFill, { scaleX: 0, transformOrigin: "left center" });

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrame >= 0) paintFrame(currentFrame, true);
    };

    const paintFrame = (index0: number, force = false) => {
      if (disposed || !ctx2d) return;
      const img = frames[index0];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (!force && index0 === currentFrame) return;
      currentFrame = index0;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw < 1 || ch < 1) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx2d.fillStyle = "#0a0a0a";
      ctx2d.fillRect(0, 0, cw, ch);
      ctx2d.drawImage(img, dx, dy, dw, dh);
    };

    const progressToFrame = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      return Math.round(p * (SCROLL_FRAME_TOTAL - 1));
    };

    const stageIndexForProgress = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        const isLast = i === stages.length - 1;
        if (isLast) {
          if (p >= s.from && p <= s.to) return i;
        } else if (p >= s.from && p < s.to) {
          return i;
        }
      }
      return Math.max(0, stages.length - 1);
    };

    const scheduleDraw = (progress: number) => {
      pendingProgress = progress;
      if (drawScheduled) return;
      drawScheduled = true;
      rafDrawId = window.requestAnimationFrame(() => {
        drawScheduled = false;
        if (disposed) return;
        paintFrame(progressToFrame(pendingProgress));
      });
    };

    const preload = () => {
      for (let i = 0; i < SCROLL_FRAME_TOTAL; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = scrollFrameSrc(i + 1);
        img.onload = () => {
          if (disposed) return;
          frames[i] = img;
          if (i === 0) paintFrame(0, true);
        };
        img.onerror = () => {
          frames[i] = null;
        };
      }
    };

    resizeCanvas();
    preload();

    const mq = window.matchMedia("(max-width: 767px)");
    const isMobile = () => mq.matches;

    const buildLabelTimeline = () => {
      const tl = gsap.timeline({ paused: true });
      const inSpan = 0.045;
      const outSpan = 0.04;

      tl.fromTo(
        eyebrow,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, ease: "none", duration: 0.04 },
        0
      );

      stages.forEach((stage, i) => {
        const el = labelEls[i];
        if (!el) return;
        const num = el.querySelector("[data-stage-num]");
        const rule = el.querySelector("[data-stage-rule]");
        const title = el.querySelector("[data-stage-title]");
        const sub = el.querySelector("[data-stage-sub]");

        const range = Math.max(0.001, stage.to - stage.from);
        const inDur = Math.min(inSpan, range * 0.4);
        const outDur = Math.min(outSpan, range * 0.35);
        const inStart = stage.from;
        const outStart = Math.max(stage.from + inDur, stage.to - outDur);
        const step = inDur / 4;

        tl.fromTo(
          el,
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: "none", duration: inDur * 0.35 },
          inStart
        );
        tl.fromTo(
          num,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, ease: "none", duration: step },
          inStart
        );
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: step },
          inStart + step * 0.5
        );
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: "none", duration: step * 1.4 },
          inStart + step * 0.7
        );
        if (sub) {
          tl.fromTo(
            sub,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, ease: "none", duration: step },
            inStart + step * 2.1
          );
        }

        tl.to(
          [sub, title].filter(Boolean),
          { autoAlpha: 0, y: -14, ease: "none", duration: outDur * 0.7 },
          outStart
        );
        tl.to(
          [num, rule],
          { autoAlpha: 0, ease: "none", duration: outDur * 0.5 },
          outStart + outDur * 0.25
        );
        tl.to(
          el,
          { autoAlpha: 0, ease: "none", duration: outDur * 0.4 },
          outStart + outDur * 0.55
        );
      });

      return tl;
    };

    const labelTl = buildLabelTimeline();

    const syncChrome = (progress: number) => {
      const active = stageIndexForProgress(progress);

      if (meterFill) gsap.set(meterFill, { scaleX: progress });

      counter.textContent = `${String(active + 1).padStart(2, "0")} — ${String(
        stages.length
      ).padStart(2, "0")}`;

      dotEls.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === active);
      });

      if (active !== lastStage) {
        lastStage = active;
      }
    };

    const ctx = gsap.context(() => {
      const getPinDistance = () =>
        stableViewportHeight() *
        ((isMobile() ? mobileScrollHeightVh : scrollHeightVh) / 100);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getPinDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: 6,
        id: "livio-scroll-frames",
        onUpdate: (self) => {
          const p = self.progress;
          scheduleDraw(p);
          labelTl.progress(p);
          syncChrome(p);
        },
      });

      scheduleDraw(0);
      labelTl.progress(0);
      syncChrome(0);
    }, section);

    const onResize = () => {
      if (!didViewportWidthChange()) return;
      resizeCanvas();
      scheduleScrollRefresh();
    };
    const onBreakpoint = () => {
      invalidateStableViewport();
      resizeCanvas();
      scheduleScrollRefresh();
    };
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onBreakpoint);
    window.addEventListener("livio:loader-complete", onBreakpoint);
    window.addEventListener("livio:scroll-unlock", onBreakpoint);

    const raf = requestAnimationFrame(() => scheduleScrollRefresh());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (rafDrawId) cancelAnimationFrame(rafDrawId);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onBreakpoint);
      window.removeEventListener("livio:loader-complete", onBreakpoint);
      window.removeEventListener("livio:scroll-unlock", onBreakpoint);
      labelTl.kill();
      ctx.revert();
      ScrollTrigger.getById("livio-scroll-frames")?.kill(true);
      frames = [];
    };
  }, [scrollHeightVh, mobileScrollHeightVh, stages]);

  return (
    <section
      ref={sectionRef}
      id="build"
      className={cn(
        "relative z-[16] h-lvh overflow-hidden bg-black text-cream-soft",
        className
      )}
      aria-label="Scroll build sequence"
    >
      <div
        ref={pinRef}
        className="relative flex h-full min-h-0 flex-col bg-black md:flex-row"
      >
        {/*
          Mobile: canvas first (visual priority), compact copy below.
          Desktop: cream editorial column left, canvas right.
        */}
        <div className="relative order-1 min-h-0 w-full flex-1 overflow-hidden bg-black md:order-2 md:h-full md:w-auto">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden
          />

          {/* Stage dots — horizontal on mobile, vertical on desktop */}
          <div
            ref={dotsRef}
            className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 flex-row items-center gap-2.5 md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:flex-col"
            aria-hidden
          >
            {stages.map((stage, i) => (
              <span
                key={stage.id}
                data-stage-dot
                title={stage.title}
                className={cn(
                  "block h-1.5 w-1.5 rounded-full bg-cream-soft/35 transition-[transform,background-color] duration-300",
                  "[&.is-active]:scale-125 [&.is-active]:bg-cream-soft"
                )}
              >
                <span className="sr-only">
                  Stage {i + 1} of {stages.length}
                </span>
              </span>
            ))}
            <span className="ml-1 h-px w-8 bg-cream-soft/25 md:ml-0 md:mt-1 md:h-10 md:w-px" />
          </div>
        </div>

        {/* Copy column */}
        <div
          ref={copyColRef}
          className="relative order-2 z-10 flex w-full shrink-0 flex-col justify-center overflow-hidden px-5 py-6 sm:px-6 sm:py-8 md:order-1 md:w-[40%] md:px-10 md:py-0 lg:w-[38%] lg:px-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_40%,rgba(255,255,255,0.06),transparent_55%)]"
          />

          <div className="relative w-full max-w-lg md:max-w-none">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5 md:mb-8">
              <p
                data-build-eyebrow
                className="flex items-center gap-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream-soft/50 sm:text-[0.65rem] sm:tracking-[0.22em]"
              >
                <span aria-hidden className="text-[0.65em]">
                  ✦
                </span>
                The build
              </p>
              <span
                ref={counterRef}
                className="font-mono text-[0.62rem] tabular-nums tracking-[0.14em] text-cream-soft/35 sm:text-[0.65rem]"
              >
                01 — 04
              </span>
            </div>

            <div
              ref={meterRef}
              className="mb-5 h-[2px] w-full overflow-hidden rounded-full bg-cream-soft/15 sm:mb-6 md:mb-10"
              aria-hidden
            >
              <div
                data-build-meter-fill
                className="h-full w-full origin-left scale-x-0 bg-cream-soft"
              />
            </div>

            <div
              ref={labelsRef}
              className="relative min-h-[5.75rem] sm:min-h-[6.5rem] md:min-h-[12rem]"
            >
              {stages.map((stage, i) => (
                <div
                  key={stage.id}
                  data-stage-label
                  className="absolute inset-x-0 top-0 will-change-transform"
                >
                  <p
                    data-stage-num
                    className="mb-2 font-display text-4xl font-bold leading-none tracking-[-0.05em] text-cream-soft/15 sm:mb-3 sm:text-5xl md:text-6xl lg:text-7xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div
                    data-stage-rule
                    className="mb-3 h-px w-10 origin-left bg-cream-soft/50 sm:mb-4 sm:w-12"
                  />
                  <h2
                    data-stage-title
                    className="max-w-[20rem] font-display text-[1.35rem] font-bold leading-tight tracking-[-0.03em] text-cream-soft sm:max-w-md sm:text-2xl md:text-[2.15rem] lg:text-4xl"
                  >
                    {stage.title}
                  </h2>
                  <p
                    data-stage-sub
                    className="mt-3 hidden max-w-sm text-sm leading-relaxed text-cream-soft/55 md:block md:text-[0.95rem]"
                  >
                    {stage.subtitle}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollFrameSection;

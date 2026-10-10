"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, scheduleScrollRefresh, stableViewportHeight } from "@/lib/gsap";

type ScrollVideoHeroProps = {
  /** Public path to the scrubbed hero video */
  src?: string;
  /** Total scroll length in viewport heights while pinned (default 400vh) */
  scrollHeightVh?: number;
  /** Lerp factor toward the scroll target (0–1). Higher = snappier. */
  lerp?: number;
  className?: string;
};

/**
 * Apple-style scroll-scrubbed video hero.
 * Scroll progress maps to video.currentTime while the section is pinned.
 * Animation runs entirely via refs + GSAP ticker (no React re-renders).
 */
export function ScrollVideoHero({
  src = "/video/hero.mp4",
  scrollHeightVh = 400,
  lerp = 0.18,
  className = "",
}: ScrollVideoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Animation state lives in refs — never triggers React renders
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const readyRef = useRef(false);
  const seekingRef = useRef(false);
  const rafActiveRef = useRef(false);
  const seekUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let tickerFn: ((time: number) => void) | null = null;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    let disposed = false;

    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));

    const lerpToward = (current: number, target: number, alpha: number) =>
      current + (target - current) * alpha;

    /**
     * Drive video.currentTime toward the scroll target every frame.
     * Uses a light lerp so fast scrolls stay smooth without hard jumps.
     */
    const tick = () => {
      if (!readyRef.current || disposed) return;

      const duration = durationRef.current;
      if (!duration || !Number.isFinite(duration)) return;

      const target = clamp(targetTimeRef.current, 0, duration);
      let current = currentTimeRef.current;

      // Snap when extremely close — avoids endless micro-seeks
      const delta = target - current;
      if (Math.abs(delta) < 0.001) {
        if (Math.abs(video.currentTime - target) > 0.001 && !seekingRef.current) {
          seekingRef.current = true;
          video.currentTime = target;
        }
        return;
      }

      // Higher catch-up rate when far behind (fast scroll), softer when close
      const distanceRatio = Math.min(1, Math.abs(delta) / Math.max(0.35, duration * 0.05));
      const alpha = lerp + (1 - lerp) * distanceRatio * 0.55;
      current = lerpToward(current, target, clamp(alpha, lerp, 0.85));
      currentTimeRef.current = current;

      // Skip redundant seeks while a previous seek is still settling (Safari)
      if (seekingRef.current) return;

      seekingRef.current = true;
      try {
        video.currentTime = current;
      } catch {
        seekingRef.current = false;
      }

      // Safety: if `seeked` never fires, unlock so scrubbing can't stall
      if (seekUnlockTimerRef.current) clearTimeout(seekUnlockTimerRef.current);
      seekUnlockTimerRef.current = setTimeout(() => {
        seekingRef.current = false;
        seekUnlockTimerRef.current = null;
      }, 120);
    };

    const onSeeked = () => {
      seekingRef.current = false;
      // If we drifted while waiting, push another frame immediately
      if (Math.abs(targetTimeRef.current - currentTimeRef.current) > 0.01) {
        tick();
      }
    };

    const onLoadedMeta = () => {
      if (disposed) return;
      const duration = video.duration;
      if (!duration || !Number.isFinite(duration)) return;

      durationRef.current = duration;
      readyRef.current = true;
      targetTimeRef.current = 0;
      currentTimeRef.current = 0;
      video.currentTime = 0;

      // Build ScrollTrigger only once metadata is known
      ctx?.revert();
      ctx = gsap.context(() => {
        // Extra scroll distance beyond the pinned 100vh viewport
        const pinDistance = Math.max(1, scrollHeightVh - 100);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${stableViewportHeight() * (pinDistance / 100)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const d = durationRef.current;
            if (!d) return;
            // progress 0 → 1 maps to full video duration
            targetTimeRef.current = self.progress * d;
          },
          onRefresh: (self) => {
            const d = durationRef.current;
            if (!d) return;
            targetTimeRef.current = self.progress * d;
          },
          id: "livio-scroll-video",
        });

        scheduleScrollRefresh();
      }, section);

      if (!rafActiveRef.current) {
        rafActiveRef.current = true;
        tickerFn = () => tick();
        gsap.ticker.add(tickerFn);
      }
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onLoadedMeta);

    // If metadata is already available (cached), init immediately
    if (video.readyState >= 1) {
      onLoadedMeta();
    } else {
      video.load();
    }

    const onLoaderDone = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", onLoaderDone);
    window.addEventListener("livio:scroll-unlock", onLoaderDone);

    return () => {
      disposed = true;
      readyRef.current = false;
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      window.removeEventListener("livio:loader-complete", onLoaderDone);
      window.removeEventListener("livio:scroll-unlock", onLoaderDone);

      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
        tickerFn = null;
      }
      rafActiveRef.current = false;
      if (seekUnlockTimerRef.current) {
        clearTimeout(seekUnlockTimerRef.current);
        seekUnlockTimerRef.current = null;
      }

      ctx?.revert();
      ScrollTrigger.getById("livio-scroll-video")?.kill(true);
    };
  }, [src, scrollHeightVh, lerp]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-lvh w-full overflow-hidden bg-black ${className}`}
      aria-label="Scroll-driven architectural film"
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={src}
        preload="auto"
        muted
        playsInline
        controls={false}
        loop={false}
        // Prevent native playback — scroll owns the timeline
        autoPlay={false}
        disablePictureInPicture
        aria-hidden
      />

      {/* Soft vignette for premium depth without covering the story */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20"
      />
    </section>
  );
}

export default ScrollVideoHero;

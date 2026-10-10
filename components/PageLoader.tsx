"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { LivioSpacesLogo } from "@/components/brand/LivioSpacesLogo";

type PageLoaderProps = {
  /** Soft floor for total form time; letter steps drive the real pacing */
  duration?: number;
  onComplete?: () => void;
};

/** Only the first-screen banner. The rest of the site loads after the curtain lifts. */
const HERO_BANNER = ["/images/hero-v2.png", "/images/hero/new-hero-img-1.png"];

function preloadAssets(urls: string[]) {
  return Promise.all(urls.map((url) => loadAsset(url)));
}

function loadAsset(url: string) {
  const timeoutMs = 4000;

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);

    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = url;
  });
}

export function PageLoader({ duration = 3600, onComplete }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });
  const heroReady = useRef(false);
  const lettersDone = useRef(false);
  const progressDone = useRef(false);
  const finishing = useRef(false);
  const dismissed = useRef(false);
  const lockedScrollY = useRef(0);
  const blockRef = useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const percentEl = percentRef.current;
    const counterWrap = counterWrapRef.current;
    const logoWrap = logoWrapRef.current;
    if (!root || !panel || !percentEl || !counterWrap || !logoWrap) return;

    lockedScrollY.current = window.scrollY || window.pageYOffset || 0;

    document.documentElement.classList.add("loader-active");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    window.dispatchEvent(new CustomEvent("livio:scroll-lock"));

    const removeScrollBlockers = () => {
      const block = blockRef.current;
      if (!block) return;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      blockRef.current = null;
    };

    const unlockScroll = () => {
      removeScrollBlockers();
      document.documentElement.classList.remove("loader-active");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, lockedScrollY.current);
      window.dispatchEvent(new CustomEvent("livio:scroll-unlock"));
    };

    const dismiss = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      unlockScroll();
      setVisible(false);
    };

    const release = () => {
      if (!lettersDone.current || !heroReady.current) return;
      if (progressDone.current || dismissed.current) return;
      progress.current.value = 100;
      percentEl.textContent = "100%";
      progressDone.current = true;
      tryFinish();
    };

    const tryFinish = () => {
      if (dismissed.current || finishing.current) return;
      if (!progressDone.current) return;
      finishing.current = true;

      // Give the exit time to finish. A short failsafe must not cut the curtain mid-lift.
      const exitFailSafe = window.setTimeout(dismiss, 3600);

      const exit = gsap.timeline({
        defaults: { ease: "sine.inOut", force3D: true },
        onComplete: () => {
          window.clearTimeout(exitFailSafe);
          dismiss();
        },
      });

      exit.call(() => {
        window.dispatchEvent(new CustomEvent("livio:loader-complete"));
        onComplete?.();
      });

      // Brief settle on 100%, then one constant lift that uncovers the hero.
      exit.to({}, { duration: 0.28 });
      exit.to(
        [logoWrap, counterWrap],
        {
          opacity: 0,
          duration: 1.15,
          ease: "sine.inOut",
        },
        0.28
      );
      exit.to(
        panel,
        {
          yPercent: -100,
          duration: 2.15,
          ease: "sine.inOut",
        },
        0.28
      );
    };

    preloadAssets(HERO_BANNER).then(() => {
      heroReady.current = true;
      release();
    });

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(
        logoWrap.querySelectorAll("[data-logo-path]")
      );
      const count = paths.length || 1;

      gsap.set(logoWrap, { opacity: 1, scale: 1 });
      percentEl.textContent = "0%";

      paths.forEach((path) => {
        gsap.set(path, {
          opacity: 0,
          y: 8,
          transformOrigin: "50% 100%",
          fill: "#171717",
        });
      });

      const form = gsap.timeline({
        onUpdate: () => {
          percentEl.textContent = `${Math.min(99, Math.round(progress.current.value))}%`;
        },
        onComplete: () => {
          lettersDone.current = true;
          release();
        },
      });

      const stepGap = 0.28;
      const letterDur = 0.72;

      paths.forEach((path, i) => {
        const at = i * stepGap;

        form.to(
          path,
          {
            opacity: 1,
            y: 0,
            duration: letterDur,
            ease: "power2.out",
          },
          at
        );

        const targetPct = Math.min(99, Math.round(((i + 1) / count) * 99));
        form.to(
          progress.current,
          {
            value: targetPct,
            duration: letterDur,
            ease: "none",
          },
          at
        );
      });
    }, root);

    const block = (e: Event) => {
      e.preventDefault();
    };
    blockRef.current = block;
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    // Last resort: letter timeline or exit never completes (background tab, iOS rAF).
    let hardCapFollowUp = 0;
    const hardCap = window.setTimeout(() => {
      heroReady.current = true;
      lettersDone.current = true;
      release();
      hardCapFollowUp = window.setTimeout(dismiss, 2800);
    }, 7000);

    return () => {
      window.clearTimeout(hardCap);
      window.clearTimeout(hardCapFollowUp);
      ctx.revert();
      removeScrollBlockers();
      document.documentElement.classList.remove("loader-active");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.touchAction = "";
    };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200]"
      aria-live="polite"
      aria-busy="true"
      role="status"
      aria-label="Loading"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 overflow-hidden bg-white"
        style={{ boxShadow: "0 28px 80px rgba(0,0,0,0.14)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div
            ref={logoWrapRef}
            className="w-[min(52vw,15rem)] text-black sm:w-[min(42vw,17rem)]"
          >
            <LivioSpacesLogo animated color="#171717" />
          </div>
        </div>

        <div
          ref={counterWrapRef}
          className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 lg:bottom-14 lg:left-14"
        >
          <span
            ref={percentRef}
            className="block font-display text-3xl font-bold tabular-nums tracking-tight text-black sm:text-4xl lg:text-5xl"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}

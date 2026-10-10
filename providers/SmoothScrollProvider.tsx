"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, scheduleScrollRefresh } from "@/lib/gsap";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    // Native scroll on touch / mobile — Lenis often blocks touch scrolling
    if (isCoarsePointer) {
      const unlockNative = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        scheduleScrollRefresh();
      };

      if (document.documentElement.classList.contains("loader-active")) {
        // Stay locked until preloader curtain finishes
      } else {
        unlockNative();
      }

      window.addEventListener("livio:scroll-unlock", unlockNative);
      window.addEventListener("livio:loader-complete", unlockNative);

      const glide = (event: Event) => {
        const top = (event as CustomEvent<number>).detail;
        if (typeof top !== "number") return;
        window.scrollTo({ top, behavior: "smooth" });
      };
      window.addEventListener("livio:scroll-glide", glide);

      return () => {
        window.removeEventListener("livio:scroll-unlock", unlockNative);
        window.removeEventListener("livio:loader-complete", unlockNative);
        window.removeEventListener("livio:scroll-glide", glide);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Start locked if preloader is active
    if (document.documentElement.classList.contains("loader-active")) {
      lenis.stop();
    }

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const lock = () => lenis.stop();
    const unlock = () => {
      lenis.start();
      scheduleScrollRefresh();
    };

    window.addEventListener("livio:scroll-lock", lock);
    window.addEventListener("livio:scroll-unlock", unlock);

    const glide = (event: Event) => {
      const top = (event as CustomEvent<number>).detail;
      if (typeof top !== "number") return;
      lenis.scrollTo(top, {
        force: true,
        duration: 1.25,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    };
    window.addEventListener("livio:scroll-glide", glide);

    return () => {
      window.removeEventListener("livio:scroll-lock", lock);
      window.removeEventListener("livio:scroll-unlock", unlock);
      window.removeEventListener("livio:scroll-glide", glide);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll on client navigations (Lenis or native)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    scheduleScrollRefresh();
  }, [pathname]);

  return <>{children}</>;
}

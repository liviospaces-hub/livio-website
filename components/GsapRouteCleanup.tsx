"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, scheduleScrollRefresh } from "@/lib/gsap";

function killMainScrollTriggers() {
  const main = document.querySelector("main");
  ScrollTrigger.getAll().forEach((t) => {
    const el = t.trigger as Element | null;
    // Only tear down page content — leave Footer/Header triggers alone
    if (!el || (main && main.contains(el))) {
      try {
        t.kill(true);
      } catch {
        /* already gone */
      }
    }
  });
}

/**
 * GSAP pin wraps DOM nodes; React soft-nav tries to removeChild against a
 * tree that no longer matches. Revert pins inside <main> during the layout
 * phase on every route change.
 */
export function GsapRouteCleanup() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    return () => {
      killMainScrollTriggers();
    };
  }, [pathname]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => scheduleScrollRefresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

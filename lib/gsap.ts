"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Address-bar show/hide fires a height-only resize. Refreshing on that
  // recalculates pin spacers and moves scroll position. Width changes
  // (rotation, real resizes) still refresh.
  // normalizeScroll is left off — it fights native Android scrolling.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

let cachedWidth = -1;
let cachedHeight = 0;
let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
let refreshFrame = 0;

/** Large viewport height in px. Ignores mobile URL-bar height changes. */
export function stableViewportHeight() {
  if (typeof window === "undefined") return 0;
  const width = window.innerWidth;
  if (cachedHeight > 0 && Math.abs(width - cachedWidth) < 2) {
    return cachedHeight;
  }
  cachedWidth = width;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;top:0;height:100lvh;width:0;visibility:hidden;pointer-events:none;";
  document.documentElement.appendChild(probe);
  cachedHeight = probe.offsetHeight || window.innerHeight;
  probe.remove();
  return cachedHeight;
}

export function invalidateStableViewport() {
  cachedWidth = -1;
}

/** True only when the layout width changed — not when the URL bar toggles. */
export function didViewportWidthChange() {
  const width = window.innerWidth;
  const changed = Math.abs(width - lastWidth) > 1;
  lastWidth = width;
  if (changed) cachedWidth = -1;
  return changed;
}

/** Coalesce the many section mount/load refreshes into a single pass. */
export function scheduleScrollRefresh() {
  if (typeof window === "undefined") return;
  window.cancelAnimationFrame(refreshFrame);
  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
}

/** Revert pins/spacers before React unmounts — prevents removeChild errors */
export function killAllScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.getAll().forEach((t) => {
    try {
      t.kill(true);
    } catch {
      /* already torn down */
    }
  });
}

export { gsap, ScrollTrigger };
export default gsap;

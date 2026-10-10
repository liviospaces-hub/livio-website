"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, scheduleScrollRefresh, stableViewportHeight } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ImageAssemblyHeroProps = {
  /** Public path to the source image (single file, CSS-sliced into tiles) */
  src?: string;
  /** Approximate column count on desktop */
  columns?: number;
  /** Approximate row count on desktop */
  rows?: number;
  /** Total scroll length while pinned, in viewport heights */
  scrollHeightVh?: number;
  className?: string;
};

type TileConfig = {
  id: number;
  col: number;
  row: number;
  /** CSS background-position */
  bgPos: string;
  /** Initial scatter transform seeds (px / deg) */
  fromX: number;
  fromY: number;
  fromRotate: number;
  fromScale: number;
  /** Stagger offset 0–1 within the timeline */
  delay: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Deterministic pseudo-random in [0, 1) from a seed — stable across renders.
 */
function hash01(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Premium scroll-driven image assembly.
 * One source image → hundreds of CSS background tiles that fly in on scrub.
 */
export function ImageAssemblyHero({
  src = "/images/grid-image.png",
  columns = 6,
  rows = 3,
  scrollHeightVh = 280,
  className = "",
}: ImageAssemblyHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Grid size is fixed at first client layout for tile memo; refreshed on resize via ST
  const gridSizeRef = useRef({ cols: columns, rows });

  const tiles = useMemo(() => {
    // SSR / first paint: use desktop density; effect may rebuild ST on resize
    const cols = columns;
    const rowsCount = rows;
    const list: TileConfig[] = [];
    const cx = (cols - 1) / 2;
    const cy = (rowsCount - 1) / 2;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const nx = cols <= 1 ? 0 : (c / (cols - 1)) * 2 - 1; // -1 … 1
        const ny = rowsCount <= 1 ? 0 : (r / (rowsCount - 1)) * 2 - 1;
        const dist = Math.hypot(c - cx, r - cy);
        const maxDist = Math.hypot(cx, cy) || 1;
        const radial = dist / maxDist;

        // Directional origin based on quadrant — intentional, not random chaos
        const dirX = nx === 0 ? (hash01(id + 1) > 0.5 ? 1 : -1) : Math.sign(nx);
        const dirY = ny === 0 ? (hash01(id + 2) > 0.5 ? 1 : -1) : Math.sign(ny);

        // Center tiles expand outward slightly; edges fly in from their corner
        const isCenter = radial < 0.28;
        const travel = isCenter
          ? 40 + hash01(id + 3) * 50
          : 120 + radial * 220 + hash01(id + 4) * 80;

        const fromX = isCenter
          ? dirX * travel * (0.35 + hash01(id + 5) * 0.4)
          : dirX * travel;
        const fromY = isCenter
          ? dirY * travel * (0.35 + hash01(id + 6) * 0.4)
          : dirY * travel;

        const fromRotate = (hash01(id + 7) - 0.5) * 8; // ±4°
        const fromScale = isCenter ? 1.12 + hash01(id + 8) * 0.08 : 0.82 + hash01(id + 9) * 0.08;

        // Edge tiles arrive earlier; center settles later — elegant wave inward
        const delay = clamp(0.05 + radial * 0.55 + hash01(id + 10) * 0.12, 0, 0.72);

        // background-position: 0% 0% = top-left tile, 100% 100% = bottom-right
        const bx = cols <= 1 ? 0 : (c / (cols - 1)) * 100;
        const by = rowsCount <= 1 ? 0 : (r / (rowsCount - 1)) * 100;

        list.push({
          id,
          col: c,
          row: r,
          bgPos: `${bx}% ${by}%`,
          fromX,
          fromY,
          fromRotate,
          fromScale,
          delay,
        });
      }
    }

    return list;
  }, [columns, rows]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    const fade = fadeRef.current;
    if (!section || !stage || !grid || !fade) return;

    const tileEls = gsap.utils.toArray<HTMLElement>(
      grid.querySelectorAll("[data-assembly-tile]")
    );

    // Match CSS grid to tile memo (desktop defaults; mobile can soft-scale via CSS)
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridSizeRef.current = { cols: columns, rows };

    const ctx = gsap.context(() => {
      // Initial scattered state — transforms only (GPU)
      tileEls.forEach((el, i) => {
        const t = tiles[i];
        if (!t) return;
        gsap.set(el, {
          x: t.fromX,
          y: t.fromY,
          rotate: t.fromRotate,
          scale: t.fromScale,
          opacity: 0,
          filter: "blur(6px)",
          force3D: true,
          transformOrigin: "50% 50%",
        });
      });

      gsap.set(fade, { opacity: 0 });

      const pinDistance = Math.max(1, scrollHeightVh - 100);

      // Prefer transform-only on smaller screens (filter blur is costly on many tiles)
      const useBlur = window.matchMedia("(min-width: 768px)").matches;
      if (!useBlur) {
        tileEls.forEach((el) => gsap.set(el, { filter: "none" }));
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${stableViewportHeight() * (pinDistance / 100)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 8,
          id: "livio-image-assembly",
        },
      });

      tileEls.forEach((el, i) => {
        const t = tiles[i];
        if (!t) return;

        const start = t.delay * 0.75;
        const duration = 0.35 + (1 - t.delay) * 0.15;

        tl.to(
          el,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ...(useBlur ? { filter: "blur(0px)" } : {}),
            duration,
            force3D: true,
          },
          start
        );
      });

      // Hold assembled image
      tl.to({}, { duration: 0.18 }, 0.82);

      // Soft fade for transition into the next section
      tl.to(fade, { opacity: 1, duration: 0.18 }, 0.9);
    }, section);

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);
    window.addEventListener("livio:scroll-unlock", refresh);
    const raf = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      window.removeEventListener("livio:scroll-unlock", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-image-assembly")?.kill(true);
    };
  }, [tiles, columns, rows, scrollHeightVh, src]);

  const bgSize = `${columns * 100}% ${rows * 100}%`;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative z-[18] h-lvh w-full overflow-hidden bg-black",
        className
      )}
      aria-label="Image assembly"
    >
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/*
          Stage is a near-full viewport frame. Tiles share one background image;
          background-size stretches the full mosaic; each tile shows its cell.
        */}
        <div
          ref={gridRef}
          className="relative h-full w-full will-change-transform"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            // Kill sub-pixel seams between tiles
            gap: 0,
            transform: "translateZ(0)",
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              data-assembly-tile
              className="relative h-full w-full will-change-transform"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: bgSize,
                backgroundPosition: tile.bgPos,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                // Micro-overlap hides sub-pixel seams
                width: "calc(100% + 1.5px)",
                height: "calc(100% + 1.5px)",
                marginLeft: "-0.75px",
                marginTop: "-0.75px",
              }}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* End-of-pin fade for handoff into the next section / video */}
      <div
        ref={fadeRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
      />
    </section>
  );
}

export default ImageAssemblyHero;

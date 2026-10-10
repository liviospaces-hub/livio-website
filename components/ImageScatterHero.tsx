"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, scheduleScrollRefresh, stableViewportHeight } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ImageScatterHeroProps = {
  /** Public path to the source image (CSS-sliced into tiles) */
  src?: string;
  title?: string;
  columns?: number;
  rows?: number;
  scrollHeightVh?: number;
  className?: string;
};

type TileConfig = {
  id: number;
  col: number;
  row: number;
  bgPos: string;
  toX: number;
  toY: number;
  toRotate: number;
  toScale: number;
  delay: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hash01(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Inverse of ImageAssemblyHero: full image by default, tiles scatter on scroll.
 */
export function ImageScatterHero({
  src = "/images/hero-v2.png",
  title = "Spaces shaped for living",
  columns = 6,
  rows = 3,
  scrollHeightVh = 280,
  className = "",
}: ImageScatterHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => {
    const cols = columns;
    const rowsCount = rows;
    const list: TileConfig[] = [];
    const cx = (cols - 1) / 2;
    const cy = (rowsCount - 1) / 2;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const nx = cols <= 1 ? 0 : (c / (cols - 1)) * 2 - 1;
        const ny = rowsCount <= 1 ? 0 : (r / (rowsCount - 1)) * 2 - 1;
        const dist = Math.hypot(c - cx, r - cy);
        const maxDist = Math.hypot(cx, cy) || 1;
        const radial = dist / maxDist;

        const dirX = nx === 0 ? (hash01(id + 1) > 0.5 ? 1 : -1) : Math.sign(nx);
        const dirY = ny === 0 ? (hash01(id + 2) > 0.5 ? 1 : -1) : Math.sign(ny);

        const isCenter = radial < 0.28;
        const travel = isCenter
          ? 40 + hash01(id + 3) * 50
          : 120 + radial * 220 + hash01(id + 4) * 80;

        const toX = isCenter
          ? dirX * travel * (0.35 + hash01(id + 5) * 0.4)
          : dirX * travel;
        const toY = isCenter
          ? dirY * travel * (0.35 + hash01(id + 6) * 0.4)
          : dirY * travel;

        const toRotate = (hash01(id + 7) - 0.5) * 8;
        const toScale = isCenter
          ? 1.12 + hash01(id + 8) * 0.08
          : 0.82 + hash01(id + 9) * 0.08;

        // Center breaks first; edges follow — wave outward
        const delay = clamp(0.05 + (1 - radial) * 0.55 + hash01(id + 10) * 0.12, 0, 0.72);

        const bx = cols <= 1 ? 0 : (c / (cols - 1)) * 100;
        const by = rowsCount <= 1 ? 0 : (r / (rowsCount - 1)) * 100;

        list.push({
          id,
          col: c,
          row: r,
          bgPos: `${bx}% ${by}%`,
          toX,
          toY,
          toRotate,
          toScale,
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
    const titleEl = titleRef.current;
    const fade = fadeRef.current;
    if (!section || !stage || !grid || !fade) return;

    const tileEls = gsap.utils.toArray<HTMLElement>(
      grid.querySelectorAll("[data-scatter-tile]")
    );

    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const ctx = gsap.context(() => {
      // Default: fully assembled image
      tileEls.forEach((el) => {
        gsap.set(el, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          force3D: true,
          transformOrigin: "50% 50%",
        });
      });

      gsap.set(fade, { opacity: 0 });
      if (titleEl) gsap.set(titleEl, { opacity: 1, y: 0 });

      const pinDistance = Math.max(1, scrollHeightVh - 100);
      const useBlur = window.matchMedia("(min-width: 768px)").matches;

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
          refreshPriority: 9,
          id: "livio-image-scatter",
        },
      });

      // Brief hold on the full image before scatter begins
      tl.to({}, { duration: 0.12 }, 0);

      tileEls.forEach((el, i) => {
        const t = tiles[i];
        if (!t) return;

        const start = 0.12 + t.delay * 0.75;
        const duration = 0.35 + (1 - t.delay) * 0.15;

        tl.to(
          el,
          {
            x: t.toX,
            y: t.toY,
            rotate: t.toRotate,
            scale: t.toScale,
            opacity: 0,
            ...(useBlur ? { filter: "blur(6px)" } : {}),
            duration,
            force3D: true,
          },
          start
        );
      });

      if (titleEl) {
        tl.to(
          titleEl,
          { opacity: 0, y: -28, duration: 0.35 },
          0.2
        );
      }

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
      ScrollTrigger.getById("livio-image-scatter")?.kill(true);
    };
  }, [tiles, columns, rows, scrollHeightVh, src]);

  const bgSize = `${columns * 100}% ${rows * 100}%`;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "hero-v2-section relative z-[19] h-lvh w-full overflow-hidden bg-black",
        className
      )}
      aria-label="Hero image scatter"
    >
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center [container-type:size]"
      >
        <div
          ref={gridRef}
          className="relative shrink-0 will-change-transform"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 0,
            transform: "translateZ(0)",
            // Cover the stage at the photo's real ratio (1708×921) — no stretch
            width: "max(100cqi, calc(100cqh * 1708 / 921))",
            aspectRatio: "1708 / 921",
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              data-scatter-tile
              className="relative h-full w-full will-change-transform"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: bgSize,
                backgroundPosition: tile.bgPos,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
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

      <h1 ref={titleRef} className="hero-v2-title">
        {title.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>

      <div
        ref={fadeRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
      />
    </section>
  );
}

export default ImageScatterHero;

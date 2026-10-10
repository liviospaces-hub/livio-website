"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import {
  gsap,
  ScrollTrigger,
  scheduleScrollRefresh,
  stableViewportHeight,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
};

const SERVICES: Service[] = [
  {
    id: "architecture",
    number: "01",
    title: "Architecture and Engineering",
    tagline: "Structures with presence",
    description:
      "From first sketch to finished shell — residences, cultural spaces, and work environments shaped with clarity, proportion, and lasting material honesty.",
    image: "/images/works/arch.png",
    accent: "#a8532e",
  },
  {
    id: "interiors",
    number: "02",
    title: "Interiors",
    tagline: "Rooms that breathe",
    description:
      "Layered light, tactile finishes, and quiet composition. We craft interiors that feel inevitable — warm, precise, and deeply livable.",
    image: "/images/works/int.png",
    accent: "#8f4324",
  },
  {
    id: "spatial",
    number: "03",
    title: "Spatial Planning",
    tagline: "Flow before finish",
    description:
      "Circulation, volume, and daylight choreographed early. Plans that make daily life effortless and every square meter purposeful.",
    image: "/images/works/spatial.jpg",
    accent: "#3d2a22",
  },
  {
    id: "landscaping",
    number: "04",
    title: "Landscaping",
    tagline: "Grounds that belong",
    description:
      "Planting, terrain, and outdoor rooms composed with the building — shade, sequence, and a landscape that feels native to the site.",
    image: "/images/works/lands.jpeg",
    accent: "#6b4a32",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const refresh = () => scheduleScrollRefresh();
    window.addEventListener("livio:loader-complete", refresh);
    window.addEventListener("livio:scroll-unlock", refresh);

    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-service-image]")
      );
      const panels = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-service-panel]")
      );
      const counter = pin.querySelector<HTMLElement>("[data-service-counter]");
      const veil = pin.querySelector<HTMLElement>("[data-service-veil]");
      const headerBits = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-service-header]")
      );

      gsap.set(images, { opacity: 0, scale: 1.12 });
      gsap.set(images[0], { opacity: 1, scale: 1 });
      gsap.set(panels, { opacity: 0, y: 36 });
      gsap.set(panels[0], { opacity: 1, y: 0 });
      gsap.set(headerBits, { opacity: 0, y: 24 });

      const setActive = (index: number) => {
        const i = Math.max(0, Math.min(SERVICES.length - 1, index));
        if (counter) {
          counter.textContent = SERVICES[i].number;
        }
      };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 35%",
            scrub: true,
          },
        })
        .to(headerBits, { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, 0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${stableViewportHeight() * (SERVICES.length * 0.95)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 4,
          id: "livio-services",
          onUpdate: (self) => {
            progressRef.current.value = self.progress;
            const idx = Math.min(
              SERVICES.length - 1,
              Math.floor(self.progress * SERVICES.length)
            );
            setActive(idx);
          },
        },
      });

      const step = 1 / SERVICES.length;

      SERVICES.forEach((_, i) => {
        if (i === 0) return;
        const at = i * step;

        tl.to(
          images[i - 1],
          { opacity: 0, scale: 1.08, duration: step * 0.55 },
          at
        );
        tl.fromTo(
          images[i],
          { opacity: 0, scale: 1.14 },
          { opacity: 1, scale: 1, duration: step * 0.65 },
          at
        );
        tl.to(
          panels[i - 1],
          { opacity: 0, y: -28, duration: step * 0.4 },
          at
        );
        tl.fromTo(
          panels[i],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: step * 0.5 },
          at + step * 0.08
        );
      });

      if (veil) {
        tl.to(veil, { opacity: 0.35, duration: 0.4 }, 0);
      }

      const span = tl.duration() || 1;
      tl.to(images, { yPercent: 6, ease: "none", duration: span }, 0);
    }, section);

    const raf = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("livio:loader-complete", refresh);
      window.removeEventListener("livio:scroll-unlock", refresh);
      ctx.revert();
      ScrollTrigger.getById("livio-services")?.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-[14] bg-ink text-cream-soft"
      aria-label="Our Services"
    >
      <div
        ref={pinRef}
        className="relative z-[14] flex min-h-lvh flex-col overflow-hidden bg-ink lg:flex-row"
      >
        {/* Visual stage */}
        <div className="relative h-[48svh] w-full shrink-0 overflow-hidden lg:h-lvh lg:w-[58%]">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              data-service-image
              className="absolute inset-0 will-change-transform"
              style={{ zIndex: SERVICES.length - i }}
            >
              <Image
                src={service.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ))}

          <div
            data-service-veil
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-50 lg:bg-gradient-to-r lg:from-transparent lg:via-ink/10 lg:to-ink"
          />

          {/* Giant ghost number */}
          <span
            data-service-counter
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-4 font-display text-[22vw] font-bold leading-none tracking-[-0.06em] text-cream-soft/15 lg:bottom-8 lg:left-8 lg:text-[12vw]"
          >
            01
          </span>
        </div>

        {/* Editorial column */}
        <div className="relative flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14 xl:px-16">
          <header className="max-w-md shrink-0">
            <p
              data-service-header
              className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-cream-soft/55"
            >
              <span aria-hidden className="text-[0.65em]">
                ✦
              </span>
              Our Services
            </p>
            <h2
              data-service-header
              className="font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] text-cream-soft sm:text-4xl lg:text-[2.75rem]"
            >
              Four practices.
              <span className="mt-1 block text-cream-soft/45">
                One language of space.
              </span>
            </h2>
          </header>

          {/* Active copy — stacked in one grid cell so panels crossfade without covering the heading */}
          <div className="mt-8 w-full max-w-lg shrink-0 overflow-hidden sm:mt-10">
            <div className="grid">
              {SERVICES.map((service, i) => (
                <article
                  key={service.id}
                  data-service-panel
                  className={cn(
                    "col-start-1 row-start-1 will-change-transform",
                    i === 0 ? "opacity-100" : "opacity-0"
                  )}
                >
                  <p className="mb-3 font-tagline text-sm font-medium tracking-wide text-terracotta sm:text-base">
                    {service.tagline}
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-cream-soft sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-cream-soft/65 sm:text-[0.95rem]">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;

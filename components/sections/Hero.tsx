"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, scheduleScrollRefresh } from "@/lib/gsap";
import { ArchitectureCard } from "./hero/ArchitectureCard";
import { ContentCard } from "./hero/ContentCard";
import { VideoCard } from "./hero/VideoCard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

const cardVariants = {
  // Cards sit fully painted under the preloader curtain
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener("livio:loader-complete", onReady);

    const t = window.setTimeout(() => {
      if (!document.documentElement.classList.contains("loader-active")) {
        setReady(true);
      }
    }, 80);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("livio:loader-complete", onReady);
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    const left = leftRef.current;
    const center = centerRef.current;
    const right = rightRef.current;
    if (!section || !left || !center || !right) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;

    // Sync scroll exit as soon as cards are marked ready
    const setupId = window.setTimeout(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        const baseTrigger = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        } as const;

        // Explicit rest state — scroll reverse returns here
        gsap.set([left, center, right], {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "center center",
        });

        // Desktop — uneven exit (left → center → right)
        mm.add("(min-width: 768px)", () => {
          const exit = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { ...baseTrigger, scrub: true },
          });

          exit.fromTo(
            left,
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              transformOrigin: "center bottom",
            },
            {
              y: -220,
              x: -180,
              rotate: -11,
              scale: 0.82,
              opacity: 0,
              duration: 0.45,
              immediateRender: false,
            },
            0
          );

          exit.fromTo(
            center,
            {
              y: 0,
              scale: 1,
              opacity: 1,
              rotate: 0,
              transformOrigin: "center center",
            },
            {
              y: -360,
              scale: 0.72,
              opacity: 0,
              rotate: 2,
              duration: 0.55,
              immediateRender: false,
            },
            0.28
          );

          exit.fromTo(
            right,
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              transformOrigin: "center bottom",
            },
            {
              y: -140,
              x: 200,
              rotate: 10,
              scale: 0.85,
              opacity: 0,
              duration: 0.7,
              immediateRender: false,
            },
            0.42
          );
        });

        mm.add("(max-width: 767px)", () => {
          const exit = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { ...baseTrigger, scrub: true },
          });

          exit
            .fromTo(
              left,
              { y: 0, scale: 1, opacity: 1 },
              {
                y: -140,
                scale: 0.9,
                opacity: 0,
                duration: 0.4,
                immediateRender: false,
              },
              0
            )
            .fromTo(
              center,
              { y: 0, scale: 1, opacity: 1 },
              {
                y: -180,
                scale: 0.88,
                opacity: 0,
                duration: 0.45,
                immediateRender: false,
              },
              0.32
            )
            .fromTo(
              right,
              { y: 0, scale: 1, opacity: 1 },
              {
                y: -200,
                scale: 0.86,
                opacity: 0,
                duration: 0.5,
                immediateRender: false,
              },
              0.58
            );
        });

        scheduleScrollRefresh();
      }, section);
    }, 50);

    return () => {
      window.clearTimeout(setupId);
      ctx?.revert();
      gsap.set([left, center, right], {
        clearProps: "transform,opacity,transformOrigin",
      });
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 mt-10 min-h-lvh overflow-hidden bg-terracotta"
      aria-label="Livio Spaces hero"
    >
      <div className="mx-auto flex min-h-lvh w-full max-w-[1600px] items-center px-3 py-20 sm:px-5 sm:py-16 lg:px-8 lg:py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:items-stretch md:gap-4 lg:gap-5"
        >
          {/* Framer owns outer (entrance); GSAP owns inner (scroll exit) */}
          <motion.div
            variants={cardVariants}
            className="md:h-[min(85vh,820px)] md:self-stretch"
          >
            <div
              ref={leftRef}
              className="h-full will-change-transform"
            >
              <ArchitectureCard className="h-full md:min-h-full" ready={ready} />
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="md:h-[min(82vh,780px)] md:self-center"
          >
            <div
              ref={centerRef}
              className="h-full will-change-transform"
            >
              <ContentCard className="h-full md:min-h-full" ready={ready} />
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="md:h-[min(85vh,820px)] md:self-stretch"
          >
            <div
              ref={rightRef}
              className="h-full will-change-transform"
            >
              <VideoCard className="h-full md:min-h-full" ready={ready} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

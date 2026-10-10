"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type VideoCardProps = {
  className?: string;
  ready?: boolean;
};

export function VideoCard({ className, ready = true }: VideoCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    const videoWrap = videoWrapRef.current;
    const vignette = vignetteRef.current;
    if (!root || !videoWrap || !vignette) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoWrap,
        { scale: 1.04, opacity: 1 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0 }
      );

      gsap.to(vignette, {
        opacity: 0.55,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <motion.div
      ref={rootRef}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative h-full min-h-[52svh] overflow-hidden rounded-[1.75rem] md:min-h-0 md:rounded-[2rem]",
        className
      )}
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 will-change-transform"
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/interior.jpg"
        >
          <source src="/video/hero0.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
      />

      <div
        ref={vignetteRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </motion.div>
  );
}

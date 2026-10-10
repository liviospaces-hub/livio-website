"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ArchitectureCardProps = {
  className?: string;
  ready?: boolean;
};

export function ArchitectureCard({
  className,
  ready = true,
}: ArchitectureCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: 1.06 },
        { scale: 1, duration: 0.8, ease: "power2.out", delay: 0 }
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(image, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
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
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero/new-hero-img-1.png"
          alt="Modern architectural facade"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

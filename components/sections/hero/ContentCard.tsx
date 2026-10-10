"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  className?: string;
  ready?: boolean;
};

const taglineLines = ["Shaping for", "the future."];

const lineVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  },
};

export function ContentCard({ className, ready = true }: ContentCardProps) {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready) return;
    const el = wordmarkRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1, opacity: 1 },
        {
          scale: 1,
          opacity: 1,
          duration: 0,
          onComplete: () => {
            gsap.to(el, {
              scale: 1.01,
              duration: 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex h-full min-h-[52svh] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-cream md:min-h-0 md:rounded-[2rem]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <h1 className="font-display text-[1.65rem] font-bold leading-[1.15] tracking-tight text-terracotta sm:text-3xl lg:text-[2.15rem]">
          {taglineLines.map((line, i) => (
            <motion.span
              key={line}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate={ready ? "visible" : "hidden"}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Brown Livio Spaces logo — bottom of center card */}
      <div
        ref={wordmarkRef}
        className="relative z-10 p-6 sm:p-8 lg:p-10"
      >
        <Image
          src="/images/logo/brown-logo.png"
          alt="Livio Spaces"
          width={320}
          height={130}
          className="h-auto w-full max-w-[16rem] sm:max-w-[20rem] lg:max-w-[22rem]"
        />
      </div>
    </motion.div>
  );
}

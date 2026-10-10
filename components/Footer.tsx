"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LivioSpacesLogo } from "@/components/brand/LivioSpacesLogo";
import { CONTACT_EMAIL, CONTACT_PHONES } from "@/lib/contact";

const EXPLORE = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://behance.net", label: "Behance" },
];

/** Same architectural letter recipes as the preloader */
const FORM_RECIPES = [
  { y: 36, x: -10, rotate: -6, scaleX: 0.55, scaleY: 0.12, origin: "0% 100%" },
  { y: -28, x: 0, rotate: 0, scaleX: 0.35, scaleY: 1.4, origin: "50% 0%" },
  { y: 22, x: 14, rotate: 8, scaleX: 0.7, scaleY: 0.2, origin: "50% 100%" },
  { y: 40, x: 0, rotate: 0, scaleX: 0.4, scaleY: 0.15, origin: "50% 100%" },
  { y: 0, x: 18, rotate: -4, scaleX: 0.2, scaleY: 0.85, origin: "100% 50%" },
  { y: 24, x: -8, rotate: 5, scaleX: 0.6, scaleY: 0.15, origin: "0% 100%" },
  { y: -18, x: 0, rotate: -3, scaleX: 0.5, scaleY: 0.25, origin: "50% 0%" },
  { y: 30, x: 6, rotate: 4, scaleX: 0.65, scaleY: 0.18, origin: "50% 100%" },
  { y: 0, x: -16, rotate: 0, scaleX: 0.25, scaleY: 0.9, origin: "0% 50%" },
  { y: 20, x: 10, rotate: -5, scaleX: 0.55, scaleY: 0.2, origin: "100% 100%" },
  { y: 26, x: 0, rotate: 3, scaleX: 0.7, scaleY: 0.12, origin: "50% 100%" },
] as const;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const formed = useRef(false);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    const logoWrap = logoWrapRef.current;
    if (!footer || !logoWrap) return;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(
        logoWrap.querySelectorAll("[data-logo-path]")
      );
      const bits = gsap.utils.toArray<HTMLElement>(
        footer.querySelectorAll("[data-footer-reveal]")
      );
      const rule = footer.querySelector<HTMLElement>("[data-footer-rule]");
      const year = footer.querySelector<HTMLElement>("[data-footer-year]");

      paths.forEach((path, i) => {
        const recipe = FORM_RECIPES[i % FORM_RECIPES.length];
        gsap.set(path, {
          opacity: 0,
          x: recipe.x,
          y: recipe.y,
          rotate: recipe.rotate,
          scaleX: recipe.scaleX,
          scaleY: recipe.scaleY,
          transformOrigin: recipe.origin,
          fill: "#f3ebe0",
          filter: "blur(8px)",
          force3D: true,
        });
      });

      gsap.set(bits, { opacity: 0, y: 28 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(year, { opacity: 0, y: 16 });

      const playLogoForm = () => {
        if (formed.current) return;
        formed.current = true;

        const stepGap = 0.1;
        const letterDur = 0.48;
        const wordBreak = 0.14;
        const form = gsap.timeline({ defaults: { ease: "power3.out" } });

        paths.forEach((path, i) => {
          const wordPad = i >= 5 ? wordBreak : 0;
          const at = i * stepGap + wordPad;

          form.to(
            path,
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scaleX: 1,
              scaleY: 1,
              filter: "blur(0px)",
              duration: letterDur,
            },
            at
          );
          form.to(
            path,
            { scaleX: 1.04, scaleY: 1.04, duration: 0.12, ease: "power1.out" },
            at + letterDur * 0.55
          );
          form.to(
            path,
            { scaleX: 1, scaleY: 1, duration: 0.18, ease: "power2.inOut" },
            at + letterDur * 0.55 + 0.12
          );
        });

        form.to(
          logoWrap,
          { scale: 1.015, duration: 0.35, ease: "power2.out" },
          "-=0.2"
        );
        form.to(logoWrap, {
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
      };

      ScrollTrigger.create({
        trigger: footer,
        start: "top 75%",
        once: true,
        onEnter: () => {
          playLogoForm();
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .to(bits, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.35)
            .to(rule, { scaleX: 1, duration: 0.8 }, 0.55)
            .to(year, { opacity: 1, y: 0, duration: 0.5 }, 0.75);
        },
        id: "livio-footer",
      });

      // Soft parallax on oversized logo while footer is in view
      gsap.to(logoWrap, {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, footer);

    return () => {
      ctx.revert();
      ScrollTrigger.getById("livio-footer")?.kill(true);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative isolate overflow-hidden bg-terracotta-deep text-cream-soft"
      aria-label="Site footer"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(243,235,224,0.12),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(0,0,0,0.25),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-[-20%] h-[70%] w-[55%] rounded-full bg-terracotta/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 pb-8 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
        {/* Forming wordmark — hero of the footer */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <p
            data-footer-reveal
            className="mb-8 flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-cream-soft/50"
          >
            <span aria-hidden className="text-[0.65em]">
              ✦
            </span>
            Livio Spaces
          </p>

          <div
            ref={logoWrapRef}
            className="w-full max-w-[min(46vw,26rem)] origin-left will-change-transform"
          >
            <LivioSpacesLogo animated color="#f3ebe0" />
          </div>

          <p
            data-footer-reveal
            className="mt-8 max-w-md font-tagline text-lg font-light leading-snug tracking-wide text-cream-soft/70 sm:mt-10 sm:text-xl"
          >
            Architecture, interiors, and design — shaped for how people live.
          </p>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div data-footer-reveal className="lg:col-span-4">
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream-soft/40">
              Start a project
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex items-start gap-3 font-display text-2xl font-bold tracking-[-0.03em] text-cream-soft transition-colors hover:text-white sm:text-3xl"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <div className="mt-4 flex flex-col gap-1.5">
              {CONTACT_PHONES.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="font-display text-lg font-semibold tracking-[-0.02em] text-cream-soft/80 transition-colors hover:text-cream-soft"
                >
                  {phone.display}
                </a>
              ))}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-soft/55">
              Tell us about your site, brief, or idea — we respond within a few
              days.
            </p>
          </div>

          <div data-footer-reveal className="lg:col-span-3 lg:col-start-6">
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream-soft/40">
              Explore
            </p>
            <ul className="flex flex-col gap-2.5">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display text-lg font-semibold tracking-[-0.02em] text-cream-soft/80 transition-colors hover:text-cream-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-reveal className="lg:col-span-3">
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream-soft/40">
              Follow
            </p>
            <ul className="flex flex-col gap-2.5">
              {SOCIAL.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.02em] text-cream-soft/80 transition-colors hover:text-cream-soft"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-footer-rule
          className="mt-16 h-px w-full origin-left bg-cream-soft/15 sm:mt-20"
        />

        <div className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p
            data-footer-year
            className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-soft/40"
          >
            © {new Date().getFullYear()} Livio Spaces · All rights reserved
          </p>
          <button
            type="button"
            data-footer-reveal
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-soft/55 transition-colors hover:text-cream-soft"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

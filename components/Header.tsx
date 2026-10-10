"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONES } from "@/lib/contact";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Project detail sits on a light surface — use brown chrome from the top
  const isWorkDetail = /^\/work\/[^/]+/.test(pathname);
  const useBrownChrome = scrolled || isWorkDetail;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "mt-3 max-w-[1100px] px-3 sm:px-4"
            : "mt-0 max-w-none px-0"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled
              ? "h-14 rounded-full border border-black/8 bg-white/85 px-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:h-[3.75rem] sm:px-5"
              : "container h-[4.5rem] bg-transparent lg:h-[5rem]"
          )}
        >
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2.5"
            aria-label="Livio Spaces home"
          >
            <Image
              src={
                useBrownChrome
                  ? "/images/logo/brown-logo.png"
                  : "/images/logo/white-logo.png"
              }
              alt="Livio Spaces"
              width={120}
              height={49}
              priority
              className={cn(
                "h-auto transition-all duration-300",
                scrolled ? "w-[5.5rem] sm:w-24" : "w-24 sm:w-28"
              )}
            />
          </Link>

          <nav
            className={cn(
              "absolute left-1/2 hidden -translate-x-1/2 items-center md:flex",
              scrolled
                ? "gap-0.5 rounded-full bg-black/[0.04] p-1"
                : "gap-1"
            )}
          >
            {navLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                tone={
                  isWorkDetail ? "brand" : scrolled ? "dark" : "light"
                }
                isActive={
                  pathname === link.href ||
                  (link.href === "/work" && isWorkDetail)
                }
              />
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2.5">
            <CtaButton
              scrolled={useBrownChrome}
              className="hidden md:inline-flex"
            />

            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:hidden",
                useBrownChrome
                  ? "bg-black/5 text-terracotta hover:bg-black/10"
                  : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              )}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                <X size={18} strokeWidth={2} />
              ) : (
                <Menu size={18} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-cream-soft md:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-5">
              <Link
                href="/"
                aria-label="Livio Spaces home"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src="/images/logo/brown-logo.png"
                  alt="Livio Spaces"
                  width={120}
                  height={49}
                  className="h-auto w-24"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-colors hover:bg-terracotta/20"
              >
                <X size={20} strokeWidth={2.25} />
              </button>
            </div>

            <motion.nav
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-[calc(100%-4.5rem)] flex-col justify-between px-6 pb-10 pt-10"
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block border-b border-terracotta/15 py-4 font-tagline text-3xl font-light tracking-tight transition-colors",
                        pathname === link.href
                          ? "text-terracotta-deep"
                          : "text-terracotta hover:text-terracotta-deep"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-6"
              >
                <div className="space-y-3 border-t border-terracotta/15 pt-6">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="block font-display text-base font-semibold tracking-[-0.02em] text-terracotta-deep"
                    onClick={() => setIsOpen(false)}
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <div className="flex flex-col gap-1.5">
                    {CONTACT_PHONES.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="font-display text-base font-semibold tracking-[-0.02em] text-terracotta"
                        onClick={() => setIsOpen(false)}
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
                <CtaButton
                  scrolled
                  className="w-full justify-center"
                  onClick={() => setIsOpen(false)}
                />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({
  href,
  label,
  tone,
  isActive,
}: {
  href: string;
  label: string;
  tone: "light" | "dark" | "brand";
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-all duration-300",
        tone === "brand" &&
          cn(
            "text-terracotta/75 hover:text-terracotta",
            isActive && "bg-terracotta/10 text-terracotta"
          ),
        tone === "dark" &&
          cn(
            "text-black/55 hover:text-black",
            isActive && "bg-white text-black shadow-sm"
          ),
        tone === "light" &&
          cn("text-white/70 hover:text-white", isActive && "text-white")
      )}
    >
      <span className="relative inline-block overflow-hidden leading-none">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[110%]">
          {label}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-[110%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        >
          {label}
        </span>
      </span>
      {tone !== "dark" && (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-1 left-1/2 h-px -translate-x-1/2 transition-all duration-500",
            tone === "brand" ? "bg-terracotta" : "bg-white",
            isActive
              ? "w-4 opacity-100"
              : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-70"
          )}
        />
      )}
    </Link>
  );
}

function CtaButton({
  scrolled,
  className,
  onClick,
}: {
  scrolled?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/contact"
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-shadow duration-300",
        scrolled
          ? "bg-terracotta text-cream shadow-[0_4px_20px_rgba(168,83,46,0.35)] hover:shadow-[0_6px_28px_rgba(168,83,46,0.45)]"
          : "bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
          scrolled ? "bg-terracotta-deep" : "bg-cream"
        )}
      />
      <span className="relative z-10">Start a project</span>
      <ArrowUpRight
        size={14}
        className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

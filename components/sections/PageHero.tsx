type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/** Compact brand hero for interior pages */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-terracotta text-cream-soft"
      aria-label={title}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] top-[-30%] h-[70%] w-[60%] rounded-full bg-terracotta-deep/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] bottom-[-40%] h-[65%] w-[50%] rounded-full bg-ink/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[42svh] max-w-[1600px] flex-col justify-end px-5 pb-14 pt-32 sm:min-h-[48svh] sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 lg:pb-20">
        <p className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-cream-soft/55 sm:mb-5">
          <span aria-hidden className="text-[0.65em]">
            ✦
          </span>
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-cream-soft">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl font-tagline text-base font-light leading-relaxed tracking-wide text-cream-soft/75 sm:mt-6 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

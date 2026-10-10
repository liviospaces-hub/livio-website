import { cn } from "@/lib/utils";

type LivioWordmarkProps = {
  className?: string;
  /** Trigger CSS sheen sweep on parent hover via group/sheen */
  sheen?: boolean;
};

/**
 * Geometric LIVIO wordmark approximating the brand lockup.
 * Color via currentColor (use text-* utilities).
 */
export function LivioWordmark({ className, sheen = false }: LivioWordmarkProps) {
  return (
    <span
      className={cn("relative inline-block overflow-hidden leading-none", className)}
      aria-label="LIVIO"
    >
      <svg
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-hidden
      >
        <g fill="currentColor">
          {/* L */}
          <path d="M4 6h22v48H58v18H4V6z" />
          {/* I */}
          <rect x="74" y="6" width="20" height="66" rx="3" />
          {/* V */}
          <path d="M112 6h22l18 56 18-56h22l-30 66h-20L112 6z" />
          {/* I */}
          <rect x="204" y="6" width="20" height="66" rx="3" />
          {/* O — rounded stadium with top & bottom gaps */}
          <path d="M248 18c0-6.627 5.373-12 12-12h28c6.627 0 12 5.373 12 12v8h-16v-6c0-2.209-1.791-4-4-4h-24c-2.209 0-4 1.791-4 4v38c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4v-6h16v8c0 6.627-5.373 12-12 12h-28c-6.627 0-12-5.373-12-12V18z" />
        </g>
      </svg>
      {sheen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 group-hover:animate-sheen"
        />
      )}
    </span>
  );
}

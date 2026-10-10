import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        border: "var(--color-border)",
        terracotta: {
          DEFAULT: "var(--color-terracotta)",
          deep: "var(--color-terracotta-deep)",
        },
        cream: {
          DEFAULT: "var(--color-cream)",
          soft: "var(--color-cream-soft)",
        },
        ink: "var(--color-ink)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-space-mono)",
          "ui-monospace",
          "monospace",
        ],
        tagline: ["var(--font-outfit)", "var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        sheen: {
          "0%": {
            transform: "translateX(-120%) skewX(-18deg)",
            opacity: "0",
          },
          "20%": { opacity: "1" },
          "100%": {
            transform: "translateX(220%) skewX(-18deg)",
            opacity: "0",
          },
        },
      },
      animation: {
        sheen: "sheen 0.85s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

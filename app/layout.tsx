import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Header } from "@/components/Header";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";
import { GsapRouteCleanup } from "@/components/GsapRouteCleanup";
import { SiteCta } from "@/components/sections/SiteCta";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const spaceMono = localFont({
  src: [
    {
      path: "./fonts/space-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/space-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

const outfit = localFont({
  src: "./fonts/outfit-latin-wght-normal.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Livio Spaces — Architecture | Interiors | Design",
  description: "Shaping for the future. Architecture, interiors, and design.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceMono.variable} ${outfit.variable} font-sans antialiased`}
      >
        <PageLoader />
        <SmoothScrollProvider>
          <GsapRouteCleanup />
          <Header />
          <main>{children}</main>
          <SiteCta />
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

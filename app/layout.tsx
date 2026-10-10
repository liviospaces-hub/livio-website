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
  metadataBase: new URL("https://liviospaces.com"),
  title: "Livio Spaces — Architecture | Interiors | Design",
  description: "Shaping for the future. Architecture, interiors, and design.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Livio Spaces — Architecture | Interiors | Design",
    description: "Shaping for the future. Architecture, interiors, and design.",
    siteName: "Livio Spaces",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Livio Spaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livio Spaces — Architecture | Interiors | Design",
    description: "Shaping for the future. Architecture, interiors, and design.",
    images: ["/og-image.jpg"],
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

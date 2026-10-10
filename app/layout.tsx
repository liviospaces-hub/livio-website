import type { Metadata } from "next";
import { Inter, Outfit, Space_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Header } from "@/components/Header";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";
import { GsapRouteCleanup } from "@/components/GsapRouteCleanup";
import { SiteCta } from "@/components/sections/SiteCta";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Livio Spaces — Architecture | Interiors | Design",
  description: "Shaping for the future. Architecture, interiors, and design.",
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

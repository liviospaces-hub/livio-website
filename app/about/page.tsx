import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { AboutIntro, AboutClarity } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About — Livio Spaces",
  description:
    "Architecture brought to life through craft and innovation. Meet Livio Spaces.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Spaces shaped with clarity and care"
        description="We bring architecture to life through craft, material honesty, and a calm sense of proportion."
      />
      <AboutIntro />
      <AboutClarity />
    </>
  );
}

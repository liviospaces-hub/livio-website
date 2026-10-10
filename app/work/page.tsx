import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { WorkPortfolio } from "@/components/sections/WorkPortfolio";

export const metadata: Metadata = {
  title: "Work — Livio Spaces",
  description:
    "Selected residences, interiors, and spatial projects by Livio Spaces. A shareable portfolio of architecture and design.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Selected work"
        description="A clear look at residences, live/work spaces, and interiors — built to share with clients and collaborators."
      />
      <WorkPortfolio />
    </>
  );
}

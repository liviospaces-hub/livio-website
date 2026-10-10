import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Services — Livio Spaces",
  description:
    "Architecture and engineering, interiors, spatial planning, and landscaping by Livio Spaces.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="How we shape spaces"
        description="From first sketch to finished grounds — architecture and engineering, interiors, spatial planning, and landscaping."
      />
      <Services />
    </>
  );
}

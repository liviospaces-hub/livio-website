import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact — Livio Spaces",
  description:
    "Start a project with Livio Spaces. Tell us about your site, brief, or idea.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s shape something together"
        description="Share a brief outline of your project — we typically respond within a few days."
      />
      <Contact />
    </>
  );
}

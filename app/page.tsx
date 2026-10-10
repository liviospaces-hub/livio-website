import { Hero } from "@/components/sections/Hero";
import { ImageScatterHero } from "@/components/ImageScatterHero";
import { AboutIntro, AboutClarity } from "@/components/sections/About";
import { ScrollFrameSection } from "@/components/ScrollFrameSection";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <ImageScatterHero />
      <AboutIntro />
      <ScrollFrameSection />
      <AboutClarity />
      <Services />
      <Projects />
      <Works />
    </>
  );
}

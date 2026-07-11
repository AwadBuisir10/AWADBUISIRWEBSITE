import { About } from "@/components/About";
import { CommunitySection } from "@/components/CommunitySection";
import { ContactSection } from "@/components/ContactSection";
import { CreativeGallery } from "@/components/CreativeGallery";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ExecutionRail } from "@/components/ExecutionRail";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LinkedInHighlights } from "@/components/LinkedInHighlights";
import { MetricStrip } from "@/components/MetricStrip";
import { Navbar } from "@/components/Navbar";
import { ReelCarousel } from "@/components/ReelCarousel";
import { SkillsSection } from "@/components/SkillsSection";
import { WorkSection } from "@/components/WorkSection";

export default function Home() {
  return (
    <main className="relative z-[1] min-h-screen bg-white text-navy">
      <Navbar />
      <ExecutionRail />
      <Hero />
      <MetricStrip />
      <div className="bg-white">
        <About />
      </div>
      <div className="bg-canvas">
        <WorkSection />
      </div>
      <div className="bg-white">
        <CommunitySection />
      </div>
      <div className="bg-canvas">
        <LinkedInHighlights />
      </div>
      <div className="bg-canvas">
        <ReelCarousel />
      </div>
      <div className="bg-white">
        <ExperienceSection />
      </div>
      <div className="bg-canvas">
        <CreativeGallery />
      </div>
      <div className="bg-white">
        <SkillsSection />
      </div>
      <div className="bg-canvas">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}

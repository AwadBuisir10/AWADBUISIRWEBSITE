import { About } from "@/components/About";
import { CommunitySection } from "@/components/CommunitySection";
import { ContactSection } from "@/components/ContactSection";
import { CreativeGallery } from "@/components/CreativeGallery";
import { CredentialsChapter } from "@/components/CredentialsChapter";
import { ExecutionRail } from "@/components/ExecutionRail";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LinkedInHighlights } from "@/components/LinkedInHighlights";
import { MetricStrip } from "@/components/MetricStrip";
import { Navbar } from "@/components/Navbar";
import { ReelCarousel } from "@/components/ReelCarousel";
import { WorkSection } from "@/components/WorkSection";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <ExecutionRail />
      <main id="main-content" className="relative z-[1] min-h-screen text-navy">
        <Hero />
        <MetricStrip />
        <div className="chapter-map">
          <About />
          <WorkSection />
        </div>
        <div className="chapter-reach">
          <CommunitySection />
          <LinkedInHighlights />
          <ReelCarousel />
        </div>
        <div className="chapter-credentials">
          <CredentialsChapter />
        </div>
        <CreativeGallery />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}

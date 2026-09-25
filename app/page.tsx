import { ContentProvider } from "@/components/ContentProvider";
import { getSiteContent } from "@/lib/sanity/server";

export const revalidate = 60;

import { About } from "@/components/About";
import { CommunitySection } from "@/components/CommunitySection";
import { ContactSection } from "@/components/ContactSection";
import { CreativeGallery } from "@/components/CreativeGallery";
import { CredentialsChapter } from "@/components/CredentialsChapter";
import { ExecutionRail } from "@/components/ExecutionRail";
import { HashNavigation } from "@/components/HashNavigation";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LinkedInHighlights } from "@/components/LinkedInHighlights";
import { MetricStrip } from "@/components/MetricStrip";
import { Navbar } from "@/components/Navbar";
import { ReelCarousel } from "@/components/ReelCarousel";
import { SpotlightLayer } from "@/components/SpotlightLayer";
import { VelocityMarquee } from "@/components/VelocityMarquee";
import { WorkSection } from "@/components/WorkSection";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <ContentProvider content={content}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <ExecutionRail />
      <SpotlightLayer />
      <HashNavigation />
      <main id="main-content" tabIndex={-1} className="relative z-[1] min-h-screen text-navy outline-none">
        <Hero />
        <MetricStrip />
        <VelocityMarquee />
        <div className="chapter-map">
          <About />
          <WorkSection />
        </div>
        <div className="chapter-credentials">
          <CredentialsChapter />
        </div>
        <div className="chapter-reach">
          <CommunitySection />
          <LinkedInHighlights />
          <ReelCarousel />
        </div>
        <CreativeGallery />
        <ContactSection />
        <Footer />
      </main>
    </ContentProvider>
  );
}

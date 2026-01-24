import EmailSignup from '@/components/main/EmailSignup';
import HeroSection from '@/components/landing/HeroSection';
import Ribbon from '@/components/main/Ribbon';
import WhatWeDo from '@/components/landing/WhatWeDo';
import OurClients from '@/components/landing/OurClients';
import ProjectHighlight from '@/components/landing/ProjectHighlight';
import MetricsSection from '@/components/landing/ImpactSection';
import SingleRibbon from '@/components/main/SingleRibbon';
// import ClientsSection from '@/components/landing/Testimonial';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/main/Footer';
import Navbar from '@/components/main/Navbar';
import { generateServiceSchema } from '@/lib/metadata';
import FadeIn from '@/components/animations/FadeIn';

export default function Home() {
  // Generate service schema for homepage
  const serviceSchemas = generateServiceSchema();

  return (
    <div className="min-h-screen w-full">
      {/* Add service structured data */}
      {serviceSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main>
        <Navbar />
        {/* Hero renders immediately - no FadeIn to avoid delaying LCP */}
        <HeroSection />
        {/* <FadeIn direction="up" delay={0.2}>
          <EmailSignup />
        </FadeIn> */}
        <div className="-mt-12 md:-mt-20 relative z-20">
          <Ribbon />
        </div>
        <FadeIn direction="up" delay={0.2}>
          <OurClients />
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <WhatWeDo />
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <ProjectHighlight />
        </FadeIn>
        <FadeIn direction="right" delay={0.1}>
          <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <MetricsSection />
        </FadeIn>
        <FadeIn direction="left" delay={0.1}>
          <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        </FadeIn>
        {/* <ClientsSection /> */}
        <FadeIn direction="up" delay={0.2}>
          <FAQSection />
        </FadeIn>
        <FadeIn direction="right" delay={0.1}>
          <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        </FadeIn>
        <Footer />
      </main>
    </div>
  );
}

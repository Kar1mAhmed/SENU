import EmailSignup from '@/components/main/EmailSignup';
import HeroSection from '@/components/landing/HeroSection';
import Ribbon from '@/components/main/Ribbon';
import WhatWeDo from '@/components/landing/WhatWeDo';
import OurClients from '@/components/landing/OurClients';
import ProjectHighlight from '@/components/landing/ProjectHighlight';
import MetricsSection from '@/components/landing/ImpactSection';
import SingleRibbon from '@/components/main/SingleRibbon';
import ClientsSection from '@/components/landing/Testimonial';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/main/Footer';
import Navbar from '@/components/main/Navbar';
import { generateServiceSchema } from '@/lib/metadata';

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
        <HeroSection />
        <EmailSignup />
        <Ribbon />
        <WhatWeDo />
        <OurClients />
        <ProjectHighlight />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        <MetricsSection />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        <ClientsSection />
        <FAQSection />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        <Footer />
      </main>
    </div>
  );
}

import EmailSignup from '@/components/main/EmailSignup';
import HeroSection from '@/components/landing/HeroSection';
import Ribbon from '@/components/main/Ribbon';
import WhatWeDo from '@/components/landing/WhatWeDo';
import OurClients from '@/components/landing/OurClients';
import ProjectHighlight from '@/components/landing/ProjectHighlight';
import MetricsSection from '@/components/landing/MetricsSection';
import SingleRibbon from '@/components/main/SingleRibbon';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <main>
        <HeroSection />
        <EmailSignup />
        <Ribbon />
        <WhatWeDo />
        <OurClients />
        <ProjectHighlight />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]"/>
        <MetricsSection />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]"/>
      </main>
    </div>
  );
}

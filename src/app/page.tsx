import EmailSignup from '@/components/main/EmailSignup';
import HeroSection from '@/components/landing/HeroSection';
import Ribbon from '@/components/main/Ribbon';
import WhatWeDo from '@/components/landing/WhatWeDo';
import OurClients from '@/components/landing/OurClients';
import ProjectHighlight from '@/components/landing/ProjectHighlight';

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
      </main>
    </div>
  );
}

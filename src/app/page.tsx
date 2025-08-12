import EmailSignup from '@/components/EmailSignup';
import HeroSection from '@/components/HeroSection';
import Ribbon from '@/components/Ribbon';
import WhatWeDo from '@/components/WhatWeDo';
import OurClients from '@/components/OurClients';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <main>
        <HeroSection />
        <EmailSignup />
        <Ribbon />
        <WhatWeDo />
        <OurClients />
      </main>
    </div>
  );
}

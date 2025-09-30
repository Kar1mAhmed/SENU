import { Suspense } from 'react';
import GetInTouchSection from '@/components/contact';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import Navbar from '@/components/main/Navbar';

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
        <GetInTouchSection />
      </Suspense>
      <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
      <Footer />
    </main>
  );
}
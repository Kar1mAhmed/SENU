import React from 'react';
import { Metadata } from 'next';
import WhoWeAre from '@/components/about/WhoWeAre';
import ServiceSection from '@/components/about/ServiceSection';
// import TeamSection from '@/components/about/TeamSection';
import QuestionsSection from '@/components/about/QuestionsSection';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import Navbar from '@/components/main/Navbar';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - Creative Design Team',
  description: 'Meet SENU, a professional creative design studio with an expert team specializing in video editing, motion graphics, 3D animation, and graphic design. Learn about our creative process and services.',
  path: '/about',
  keywords: ['about us', 'creative team', 'design studio', 'video editing team', 'creative agency']
});

const AboutPage = () => {
  console.log('📖 About page loading - time to spill the tea about who we are!');

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="pt-12 mt-32">
        <WhoWeAre />
        <QuestionsSection />
        <ServiceSection />
        {/* <TeamSection /> */}
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        <Footer />
      </main>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import WhoWeAre from '@/components/about/WhoWeAre';
import ServiceSection from '@/components/about/ServiceSection';
import TeamSection from '@/components/about/TeamSection';
import QuestionsSection from '@/components/about/QuestionsSection';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import Navbar from '@/components/main/Navbar';

const AboutPage = () => {
  console.log('📖 About page loading - time to spill the tea about who we are!');

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="pt-12 mt-32">
        <WhoWeAre />
        <QuestionsSection />
        <ServiceSection />
        <TeamSection />
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
        <Footer />
      </main>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import Navbar from '@/components/main/Navbar';
import WhoWeAre from '@/components/about/WhoWeAre';
import  QuestionsSection from '@/components/about/QuestionsSection';

const AboutPage = () => {
  console.log('📖 About page loading - time to spill the tea about who we are!');

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="pt-12">
        <WhoWeAre />
        <QuestionsSection />
      </main>
    </div>
  );
};

export default AboutPage;

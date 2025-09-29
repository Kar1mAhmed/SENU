import React from 'react';

const HeroSection = () => {
  return (
    <section className="h-[70vh] w-full relative flex items-center justify-center md:mt-32">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="relative w-11/12 md:w-7/12 h-auto aspect-video rounded-2xl object-cover shadow-lg"
      >
        <source src="/SHOWREEL.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default HeroSection;

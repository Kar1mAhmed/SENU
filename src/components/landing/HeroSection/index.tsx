import React from 'react';

const HeroSection = () => {
  return (
    <section className="h-screen w-full relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/SHOWREEL.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </section>
  );
};

export default HeroSection;

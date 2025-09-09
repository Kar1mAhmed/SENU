'use client';
import React from 'react';

const WhoWeAre = () => {
  console.log('🎯 WHO WE ARE section rendering - making a bold statement!');

  return (
    <section className="w-full px-4 lg:px-0 mb-24">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="font-new-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-semibold text-center mb-4">
          ABOUT US
        </h1>
      </div>
    </section>
  );
};

export default WhoWeAre;

'use client';
import React from 'react';
import { mockServices } from '@/lib/mock-data';
import Image from 'next/image';

const WhatWeDoSection = () => {
  console.log('🚀 What We Do section rendering - time to show off our skills!');

  return (
    <section className="w-full px-4 lg:px-0 py-20 bg-black text-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-new-black text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            WHAT WE DO
          </h2>
          <p className="font-alexandria text-base sm:text-lg text-white/80 max-w-3xl mx-auto">
            We are a collective of passionate designers, artists, and creative minds who believe in the power of visual storytelling. Our diverse backgrounds allow us to bring unique perspectives to every project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockServices.map((service) => (
            <div key={service.id} className="bg-gray-800/50 rounded-lg p-6 flex flex-col items-start space-y-4">
              <div className={`w-16 h-16 rounded-full ${service.accentColor} flex items-center justify-center mb-4`}>
                <Image src={service.imageSrc} alt={service.title} width={32} height={32} />
              </div>
              <h3 className="font-new-black text-2xl font-bold">{service.title}</h3>
              <p className="font-alexandria text-white/70 flex-grow">{service.description}</p>
              <p className="font-alexandria text-sm font-semibold text-white/50 pt-4">
                {service.projectsCount} Projects
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;

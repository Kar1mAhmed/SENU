'use client';
import React from 'react';
import Navbar from '@/components/main/Navbar';
import BackgroundGrid from '@/components/main/BackgroundGrid';
import SingleRibbon from '@/components/main/SingleRibbon';

export default function GlobalNotFound() {
  return (
    <>
      {/* Add styles to remove navbar glow */}
      <style jsx global>{`
        .navbar-no-glow a {
          text-shadow: none !important;
          box-shadow: none !important;
        }
      `}</style>
      
      <div className="navbar-no-glow">
        <Navbar />
      </div>
      <BackgroundGrid />

      {/* Glassy ribbons with gray icons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-40 ">
          {/* First glassy ribbon (behind the text) */}
          <div className="absolute top-[90%] w-full z-[30]">
            <SingleRibbon 
              bgClass="bg-glass-fill backdrop-blur-md border border-white/10" 
              iconColorClass="bg-[#8E8E8E]" 
              heightClass="h-[35px] md:h-[45px]"
              rotation={-4}
            />
          </div>
          
          {/* Second glassy ribbon (in front of the text) */}
          <div className="absolute top-[90%] w-full z-[-5]">
            <SingleRibbon 
              bgClass="bg-glass-fill backdrop-blur-md border border-white/10" 
              iconColorClass="bg-[#8E8E8E]" 
              heightClass="h-[35px] md:h-[45px]"
              rotation={4}
            />
          </div>
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(90vh-45px)] px-4 z-[10]">
        <div className="transform -rotate-[-4deg]">
          <p className="text-white/20 font-new-black text-4xl md:text-6xl lg:text-7xl font-black">ERROR</p>
          <h1 className="font-new-black text-[160px] md:text-[280px] lg:text-[400px] leading-none text-white/10 tracking-tight select-none font-black -mt-4 md:-mt-8">404</h1>
        </div>
      </main>

      {/* Orange bottom ribbon with yellow icons - part of page flow */}
      <div className="w-full">
        <SingleRibbon 
          bgClass="bg-orange" 
          iconColorClass="bg-yellow" 
          heightClass="h-[35px] md:h-[45px]"
        />
      </div>
    </>
  );
}

import React from 'react';
import HeroText from './HeroText';
import HeroGallery from './HeroGallery';

/**
 * HeroSection - Optimized for LCP
 * 
 * Performance optimizations:
 * - HeroText renders immediately with the hero heading
 * - HeroGallery handles data fetching and gallery rendering
 * - No FadeIn wrapper (applied at page level for below-fold sections only)
 * 
 * Previous issues fixed:
 * - 'use client' on entire component blocked server rendering
 * - useThumbnails hook delayed initial render
 * - WebGL gallery loaded before text was visible
 */
const HeroSection = () => {
  return (
    <section className="md:h-screen w-full flex flex-col md:justify-center px-4 lg:px-8 lg:mt-40 mt-36 py-8 md:py-0">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Hero Text - Renders immediately */}
        <HeroText />

        {/* Gallery - Project Thumbnails - Loads data client-side */}
        <div className="w-full h-[450px] md:h-[400px] xl:h-[500px]">
          <HeroGallery />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

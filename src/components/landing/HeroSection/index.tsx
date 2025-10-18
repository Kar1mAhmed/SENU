'use client';
import React from 'react';
import RotatingText from '@/components/animations/RotatingText';
import WebGLGallery from '@/components/animations/WebGLGallery';
import { useThumbnails } from '@/lib/hooks/useThumbnails';

const HeroSection = () => {
  const { thumbnails, loading } = useThumbnails(12);

  // Transform thumbnails to gallery format
  const galleryItems = thumbnails.map(thumb => ({
    image: thumb.thumbnailUrl,
    text: thumb.name
  }));

  return (
    <section className="h-screen w-full flex flex-col justify-center px-4 lg:px-8 mt-16">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Hero Text with Rotating Animation */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="font-new-black text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
            YOUR PROJECTS ARE
          </h1>
          <h1 className="font-new-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
            <RotatingText 
              words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']} 
              duration={2500}
            /> WITH US
          </h1>
        </div>

        {/* WebGL Gallery - Project Thumbnails */}
        <div className="w-full h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <WebGLGallery 
              items={galleryItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              font="bold 24px Alexandria"
              scrollSpeed={2}
              scrollEase={0.05}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

'use client';
import React, { useEffect } from 'react';
import { keyToUrl } from '@/lib/media';
import { ProjectSlide } from '@/lib/types';
import VideoPlayer from '@/components/main/VideoPlayer';

interface VerticalSlidesProps {
  slides: ProjectSlide[];
}

console.log('📱 VerticalSlides component loaded - ready to showcase vertical videos like TikTok/Instagram reels!');

const VerticalSlides: React.FC<VerticalSlidesProps> = ({ slides }) => {
  console.log('📱 Vertical slides received:', slides.length, 'slides ready to rock like TikTok stars!');

  // Preload video metadata on mount to keep them ready
  useEffect(() => {
    console.log('🎨 Preloading vertical video metadata to keep in memory');
    slides.forEach((slide) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = keyToUrl(slide.mediaKey) || '';
    });
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
          <div className="text-center text-gray-400">
            <p>No vertical slides available for this project.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* Vertical slides - 9:16 mobile video format */}
        <div className="space-y-20">
          {slides.map((slide, index) => {
            const hasText = slide.text && slide.text.trim().length > 0;
            // Alternate text position: even index = left, odd index = right
            const isTextLeft = index % 2 === 0;

            console.log(`📱 Rendering slide ${index + 1}: text ${hasText ? 'exists' : 'missing'}, position: ${isTextLeft ? 'left' : 'right'}`);

            return (
              <div key={slide.id} className="w-full">
                {hasText ? (
                  // Layout with text: Alternating sides on desktop / stacked on mobile
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-[1100px] mx-auto">
                    {/* Text Section - Alternates between left and right */}
                    <div className={`flex flex-col justify-center ${isTextLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="space-y-4 lg:space-y-6">
                        {/* Large Yellow Reel Number */}
                        <div className="text-[#F5A623] font-new-black text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        {/* Beautiful Description Text */}
                        <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-alexandria leading-relaxed max-w-md">
                          {slide.text}
                        </p>
                      </div>
                    </div>

                    {/* Video Section - Alternates between right and left, centered */}
                    <div className={`flex justify-center ${isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16]">
                        <VideoPlayer
                          videoUrl={keyToUrl(slide.mediaKey) || ''}
                          projectType="vertical"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Layout without text: Video centered
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-[9/16]">
                      <VideoPlayer
                        videoUrl={keyToUrl(slide.mediaKey) || ''}
                        projectType="vertical"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VerticalSlides;

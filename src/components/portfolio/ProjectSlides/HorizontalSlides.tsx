'use client';
import React from 'react';
import { keyToUrl } from '@/lib/media';
import { ProjectSlide } from '@/lib/types';
import VideoPlayer from '@/components/main/VideoPlayer';

interface HorizontalSlidesProps {
  slides: ProjectSlide[];
}

console.log('🎥 HorizontalSlides component loaded - ready to showcase horizontal videos in style!');

const HorizontalSlides: React.FC<HorizontalSlidesProps> = ({ slides }) => {
  // Filter and sort slides to handle missing ones in the middle
  const horizontalSlides = [...slides]
    .filter(slide => slide && slide.type === 'horizontal' && slide.mediaKey)
    .sort((a, b) => a.order - b.order);

  console.log('🎥 Horizontal slides found:', horizontalSlides.length);

  if (horizontalSlides.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
          <div className="text-center text-gray-400">
            <p>No horizontal slides available for this project.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* Horizontal slides - 16:9 video format with full-width video player */}
        <div className="space-y-16">
          {horizontalSlides.map((slide) => (
            <div key={slide.id} className="w-full">
              {/* Video Player - Max height 80vh on large screens */}
              <div className="relative w-full aspect-video lg:max-h-[80vh]">
                <VideoPlayer
                  videoUrl={keyToUrl(slide.mediaKey) || ''}
                  projectType="horizontal"
                  className="w-full h-full"
                  lazyLoad={true}
                  autoGeneratePoster={false}
                />
              </div>

              {/* Optional Text Below Video */}
              {slide.text && (
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    {slide.text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalSlides;

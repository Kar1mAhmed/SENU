'use client';
import React from 'react';
import Image from 'next/image';
import { keyToUrl } from '@/lib/media';
import { ProjectSlide } from '@/lib/types';

interface HorizontalSlidesProps {
  slides: ProjectSlide[];
}

const HorizontalSlides: React.FC<HorizontalSlidesProps> = ({ slides }) => {
  // Filter only horizontal slides
  const horizontalSlides = slides.filter(slide => slide.type === 'horizontal');

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
        {/* Horizontal slides - 16:9 video format */}
        <div className="space-y-12">
          {horizontalSlides.map((slide, index) => (
            <div key={slide.id} className="w-full">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src={keyToUrl(slide.mediaKey) || ''}
                  alt={slide.text || `Horizontal slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={95}
                />
              </div>
              {slide.text && (
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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

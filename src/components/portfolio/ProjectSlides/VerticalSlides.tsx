'use client';
import React from 'react';
import Image from 'next/image';
import { keyToUrl } from '@/lib/media';
import { ProjectSlide } from '@/lib/types';

interface VerticalSlidesProps {
  slides: ProjectSlide[];
}
console.log('📱 VerticalSlides component loaded - ready to showcase vertical slides like TikTok/Instagram!');

const VerticalSlides: React.FC<VerticalSlidesProps> = ({ slides }) => {
  // Filter only vertical slides
  const verticalSlides = slides.filter(slide => slide.type === 'vertical');

  if (verticalSlides.length === 0) {
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
        {/* Vertical slides grid - optimized for mobile-first reel format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {verticalSlides.map((slide, index) => (
            <div key={slide.id} className="w-full">
              <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src={keyToUrl(slide.mediaKey) || ''}
                  alt={slide.text || `Vertical slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={95}
                />
              </div>
              {slide.text && (
                <p className="mt-3 text-sm text-gray-400 text-center">
                  {slide.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalSlides;

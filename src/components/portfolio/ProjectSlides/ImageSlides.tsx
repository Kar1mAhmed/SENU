'use client';
import React from 'react';
import Image from 'next/image';
import { ProjectSlide } from '@/lib/types';
import { keyToUrl } from '@/lib/media';

interface ImageSlidesProps {
  slides: ProjectSlide[];
}

console.log('🖼️ ImageSlides component loaded - ready to showcase image slides like Behance!');

const ImageSlides: React.FC<ImageSlidesProps> = ({ slides }) => {
  // Filter only image slides
  const imageSlides = slides.filter(slide => slide.type === 'image');

  console.log('🖼️ Image slides found:', imageSlides.length);
  if (imageSlides.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
          <div className="text-center text-gray-400">
            <p>No image slides available for this project.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Full-width image presentation - no gaps between images */}
      <div className="w-full">
        {imageSlides.map((slide, index) => (
          <div key={slide.id} className="w-full block">
            <Image
              src={keyToUrl(slide.mediaKey) || ''}
              alt={slide.text || `Project slide ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto object-contain block"
              priority={index === 0} // Prioritize first image
              quality={95}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageSlides;

'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ProjectSlide } from '@/lib/types';
import { keyToUrl } from '@/lib/media';

interface ImageSlidesProps {
  slides: ProjectSlide[];
}

console.log('🖼️ ImageSlides component loaded - ready to showcase image slides like Behance!');

const ImageSlides: React.FC<ImageSlidesProps> = ({ slides }) => {
  // Track slides with broken/missing images
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // Filter and sort slides to handle missing ones in the middle
  const imageSlides = [...slides]
    .filter(slide => slide && slide.type === 'image' && slide.mediaKey)
    .sort((a, b) => a.order - b.order);

  console.log('🖼️ Image slides found:', imageSlides.length);

  // Handle image load error - hide broken images
  const handleImageError = useCallback((slideId: string) => {
    console.warn('⚠️ Image failed to load for slide:', slideId);
    setBrokenImages(prev => new Set(prev).add(slideId));
  }, []);

  // Filter out broken images from display
  const validImageSlides = imageSlides.filter(slide => !brokenImages.has(slide.id));

  // Preload all images on mount to detect broken ones early
  useEffect(() => {
    console.log('🎨 Preloading all slide images to detect broken ones');
    imageSlides.forEach((slide) => {
      const img = new window.Image();
      img.onerror = () => handleImageError(slide.id);
      img.src = keyToUrl(slide.mediaKey) || '';
    });
  }, [imageSlides, handleImageError]);

  if (validImageSlides.length === 0) {
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
        {validImageSlides.map((slide, index) => (
          <div key={slide.id} className="w-full block">
            <Image
              src={keyToUrl(slide.mediaKey) || ''}
              alt={slide.text || `Project slide ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto object-contain block"
              priority={index < 3} // Prioritize first 3 images
              loading={index < 3 ? 'eager' : 'lazy'} // Load first 3 eagerly, rest lazily
              quality={95}
              unoptimized={false} // Keep optimization for better caching
              onError={() => handleImageError(slide.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageSlides;

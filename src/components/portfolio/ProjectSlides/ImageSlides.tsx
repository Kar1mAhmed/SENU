'use client';
import React from 'react';
import Image from 'next/image';
import { ProjectSlide } from '@/lib/types';

interface ImageSlidesProps {
  slides: ProjectSlide[];
}

console.log('🖼️ ImageSlides component loaded - ready to showcase image slides like Behance!');

/**
 * Transform R2 URL to use our media serving endpoint
 */
function transformMediaUrl(r2Url: string): string {
  if (!r2Url) return r2Url;
  
  try {
    // Extract the key from the R2 URL
    // R2 URLs typically look like: https://pub-xxx.r2.dev/folder/file.jpg
    const url = new URL(r2Url);
    const key = url.pathname.substring(1); // Remove leading slash
    
    // Convert to our media endpoint
    const mediaUrl = `/api/media/${key}`;
    console.log('🔄 Transformed slide media URL:', r2Url, '→', mediaUrl);
    
    return mediaUrl;
  } catch (error) {
    console.warn('⚠️ Failed to transform slide media URL:', r2Url, error);
    return r2Url; // Return original if transformation fails
  }
}

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
              src={transformMediaUrl(slide.mediaUrl)}
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

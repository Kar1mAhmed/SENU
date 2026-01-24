'use client';
import React from 'react';
import HeroText from './HeroText';
import ScrollingCardColumns from './ScrollingCardColumns';
import MobileCardGrid from './MobileCardGrid';
import { useThumbnails } from '@/lib/hooks/useThumbnails';

interface GalleryItem {
  image: string;
  text: string;
  link: string;
}

// Skeleton loader for gallery while loading
function GallerySkeleton({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="space-y-3">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-3 overflow-hidden px-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[130px] aspect-[3/4] rounded-xl bg-neutral-900 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-full px-2">
      {[0, 1, 2].map((col) => (
        <div key={col} className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[3/4] rounded-2xl bg-neutral-900 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * HeroSection - Superside-style split layout
 * Using flex instead of grid to avoid production rendering issues
 */
const HeroSection = () => {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
  const { thumbnails, loading } = useThumbnails(15);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Transform thumbnails to gallery format
  const galleryItems: GalleryItem[] = thumbnails.map((thumb) => {
    const urlFriendlyName = thumb.name.replace(/\s+/g, '-');
    return {
      image: thumb.thumbnailUrl,
      text: thumb.name,
      link: `/portfolio/${urlFriendlyName}`,
    };
  });

  if (isMobile === null) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <div className="max-w-[1500px] w-full px-6 md:px-12">
          <GallerySkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-screen flex items-center overflow-hidden relative">
      <div className="max-w-[1800px] mx-auto w-full h-full flex items-center px-4 md:px-10 lg:px-16 xl:px-24">
        {/* Desktop Layout - Flex based split */}
        {/* Laptop: Gap-8, 45% Text / 55% Gallery for better fit */}
        {/* Desktop: Gap-32, 50% Text / 50% Gallery for spacious look */}
        <div className="hidden md:flex md:flex-row gap-8 lg:gap-8 xl:gap-32 items-center w-full h-full pt-24 pb-0">
          {/* Left side: Text content - vertically centered */}
          <div className="w-[50%] lg:w-[45%] xl:w-[50%] flex-shrink-0 h-full flex items-center">
            <HeroText />
          </div>

          {/* Right side: Gallery - Added padding to prevent cutoff on right */}
          <div className="w-[50%] lg:w-[55%] xl:w-[50%] flex-shrink-0 h-full pr-4 lg:pr-10 xl:pr-0">
            {loading && galleryItems.length === 0 ? (
              <GallerySkeleton />
            ) : (
              <ScrollingCardColumns items={galleryItems} />
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden gap-8 w-full">
          <div className="px-2">
            <HeroText />
          </div>
          <div className="w-full -mx-4 group">
            {loading && galleryItems.length === 0 ? (
              <GallerySkeleton isMobile />
            ) : (
              <MobileCardGrid items={galleryItems} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

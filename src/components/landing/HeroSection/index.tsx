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
          <div key={row} className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[140px] aspect-[3/4] rounded-xl bg-neutral-900 animate-pulse"
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
 * 
 * Desktop: Text on left (40%), Scrolling cards on right (60%)
 * Mobile: Text on top, then 2-row card grid below
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

  // Don't render until we know the device type
  if (isMobile === null) {
    return (
      <section className="w-full min-h-screen flex items-center px-4 lg:px-8 pt-32 md:pt-0">
        <div className="max-w-[1400px] mx-auto w-full">
          <GallerySkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex items-center px-4 lg:px-8 pt-32 md:pt-0">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Desktop Layout: Split view */}
        <div className="hidden md:flex md:flex-row gap-8 lg:gap-12 items-center">
          {/* Left side: Text content */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex-shrink-0">
            <HeroText />
          </div>

          {/* Right side: Scrolling card columns */}
          <div className="w-full md:w-[55%] lg:w-[60%] h-[600px] lg:h-[700px]">
            {loading && galleryItems.length === 0 ? (
              <GallerySkeleton />
            ) : (
              <ScrollingCardColumns items={galleryItems} />
            )}
          </div>
        </div>

        {/* Mobile Layout: Stacked view */}
        <div className="flex flex-col md:hidden gap-8">
          {/* Text content */}
          <HeroText />

          {/* Two-row card grid */}
          <div className="w-full -mx-4 px-4">
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

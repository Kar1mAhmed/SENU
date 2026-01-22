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
    <section className="w-full h-screen flex items-center pt-20 md:pt-0 overflow-hidden relative">
      <div className="max-w-[1800px] mx-auto w-full h-full flex items-center px-4 md:px-10 lg:px-16 xl:px-24">
        {/* Desktop Layout - 50/50 Split Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center w-full h-[85vh]">
          {/* Left side: Text content - centered within its half */}
          <div className="w-full flex justify-center z-20">
            <div className="max-w-xl w-full">
              <HeroText />
            </div>
          </div>

          {/* Right side: Gallery - occupies the other half */}
          <div className="w-full h-full min-w-0 z-10 relative">
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

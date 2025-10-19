'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GalleryItem {
  image: string;
  text: string;
  link?: string;
}

interface SimpleGalleryProps {
  items: GalleryItem[];
}

// Preload and cache images
const preloadImages = async (items: GalleryItem[]) => {
  const promises = items.map(item => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Still resolve on error
      img.crossOrigin = 'anonymous';
      img.src = item.image;
    });
  });
  await Promise.all(promises);
};

export default function SimpleGallery({ items }: SimpleGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const router = useRouter();

  // Preload all images on mount
  useEffect(() => {
    preloadImages(items).then(() => {
      setImagesLoaded(true);
    });
  }, [items]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (link?: string) => {
    if (!isDragging && link) {
      router.push(link);
    }
  };

  // Triple the items for infinite scroll
  const infiniteItems = [...items, ...items, ...items];

  // Handle infinite scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth / 3;
      const scrollLeft = container.scrollLeft;

      if (scrollLeft >= scrollWidth * 2) {
        container.scrollLeft = scrollLeft - scrollWidth;
      } else if (scrollLeft <= 0) {
        container.scrollLeft = scrollWidth + scrollLeft;
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Start in the middle
    container.scrollLeft = container.scrollWidth / 3;

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none h-full py-4"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {infiniteItems.map((item, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[200px] flex flex-col gap-2 cursor-pointer"
          onClick={() => handleClick(item.link)}
        >
          <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden bg-neutral-900">
            <img
              src={item.image}
              alt={item.text}
              className="w-full h-full object-cover"
              draggable={false}
              loading="eager"
              crossOrigin="anonymous"
              decoding="async"
            />
          </div>
          <p className="font-new-black font-light text-white text-sm text-center px-2 leading-tight">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

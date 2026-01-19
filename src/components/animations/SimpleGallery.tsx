'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import cfImageLoader from '@/lib/imageLoader';

interface GalleryItem {
  image: string;
  text: string;
  link?: string;
}

interface SimpleGalleryProps {
  items: GalleryItem[];
}

interface ImageState {
  src: string;
  loading: boolean;
  error: boolean;
  retryCount: number;
}

export default function SimpleGallery({ items }: SimpleGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const router = useRouter();

  // Track image loading states
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});

  // Track which images are in viewport for lazy loading
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());

  // Initialize image states
  useEffect(() => {
    const states: Record<string, ImageState> = {};
    items.forEach((item, idx) => {
      const key = `${idx}-${item.image}`;
      states[key] = {
        src: item.image,
        loading: true,
        error: false,
        retryCount: 0,
      };
    });
    setImageStates(states);

    // Mark first 5 images as visible for priority loading
    setVisibleImages(new Set([0, 1, 2, 3, 4]));
  }, [items]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleImages(prev => new Set([...prev, index]));
          }
        });
      },
      {
        root: scrollRef.current,
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    // Observe all items
    const items = scrollRef.current?.querySelectorAll('[data-index]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
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

  // Handle image load success
  const handleImageLoad = (key: string) => {
    setImageStates(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: false, error: false },
    }));
  };

  // Handle image load error with retry logic
  const handleImageError = (key: string, originalSrc: string) => {
    setImageStates(prev => {
      const state = prev[key];
      if (!state) return prev;

      const newRetryCount = state.retryCount + 1;
      const maxRetries = 3;

      if (newRetryCount < maxRetries) {
        // Retry with exponential backoff
        const delay = 500 * Math.pow(2, newRetryCount - 1);
        console.log(`Retrying image ${key} (attempt ${newRetryCount}/${maxRetries}) in ${delay}ms`);

        setTimeout(() => {
          // Try with image proxy as fallback
          const proxySrc = `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
          setImageStates(prevStates => ({
            ...prevStates,
            [key]: {
              ...prevStates[key],
              src: newRetryCount === 1 ? proxySrc : originalSrc,
              retryCount: newRetryCount,
              loading: true,
            },
          }));
        }, delay);

        return prev;
      } else {
        // All retries exhausted - show error state
        console.error(`Image ${key} failed after ${maxRetries} attempts`);
        return {
          ...prev,
          [key]: {
            ...state,
            loading: false,
            error: true,
            retryCount: newRetryCount,
          },
        };
      }
    });
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
      {infiniteItems.map((item, index) => {
        const itemIndex = index % items.length;
        const key = `${itemIndex}-${item.image}`;
        const imageState = imageStates[key] || { src: item.image, loading: true, error: false, retryCount: 0 };
        const isVisible = visibleImages.has(itemIndex);
        const isPriority = itemIndex < 3; // First 3 images get priority

        return (
          <div
            key={index}
            data-index={itemIndex}
            className="flex-shrink-0 w-[200px] flex flex-col gap-2 cursor-pointer"
            onClick={() => handleClick(item.link)}
          >
            <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden bg-neutral-900">
              {/* Loading shimmer */}
              {imageState.loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 animate-pulse" />
              )}

              {/* Error state */}
              {imageState.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-600">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-center px-2">Image unavailable</p>
                </div>
              )}

              {/* Actual image - only render if visible or priority */}
              {!imageState.error && (isVisible || isPriority) && (
                <Image
                  loader={cfImageLoader}
                  src={imageState.src}
                  alt={item.text}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className={`object-cover transition-opacity duration-300 ${imageState.loading ? 'opacity-0' : 'opacity-100'
                    }`}
                  draggable={false}
                  priority={isPriority}
                  loading={isPriority ? undefined : 'lazy'}
                  quality={75}
                  onLoad={() => handleImageLoad(key)}
                  onError={() => handleImageError(key, item.image)}
                  unoptimized={false} // Ensure we try to optimize
                />
              )}
            </div>
            <p className="font-new-black font-light text-white text-sm text-center px-2 leading-tight">
              {item.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import cfImageLoader from '@/lib/imageLoader';

interface GalleryItem {
    image: string;
    text: string;
    link?: string;
}

interface MobileCardGridProps {
    items: GalleryItem[];
}

// Auto-scrolling row component with mouse drag support
function AutoScrollRow({
    items,
    direction = 'left',
    onCardClick
}: {
    items: GalleryItem[];
    direction?: 'left' | 'right';
    onCardClick: (link?: string) => void;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const dragStartX = useRef(0);
    const hasDragged = useRef(false);

    // Triple items for infinite scroll
    const tripleItems = [...items, ...items, ...items];

    const handleImageLoad = (index: number) => {
        setImageLoadStates(prev => ({ ...prev, [index]: true }));
    };

    // Mouse/touch event handlers for drag scrolling
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!rowRef.current) return;
        setIsDragging(true);
        dragStartX.current = e.pageX;
        hasDragged.current = false;
        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
        rowRef.current.style.cursor = 'grabbing';
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!rowRef.current) return;
        setIsDragging(true);
        dragStartX.current = e.touches[0].pageX;
        hasDragged.current = false;
        setStartX(e.touches[0].pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !rowRef.current) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(e.pageX - dragStartX.current) > 5) {
            hasDragged.current = true;
        }
        rowRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging || !rowRef.current) return;
        const x = e.touches[0].pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(e.touches[0].pageX - dragStartX.current) > 5) {
            hasDragged.current = true;
        }
        rowRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        if (rowRef.current) {
            rowRef.current.style.cursor = 'grab';
        }
    }, []);

    const handleCardClick = useCallback((link?: string) => {
        if (!hasDragged.current && link) {
            onCardClick(link);
        }
    }, [onCardClick]);

    // Auto-scroll animation
    useEffect(() => {
        const container = rowRef.current;
        if (!container) return;

        let animationId: number;
        let lastTime = 0;
        const speed = direction === 'left' ? 0.5 : -0.5; // Slow auto-scroll

        const animate = (currentTime: number) => {
            if (!isDragging && container) {
                if (lastTime) {
                    const delta = currentTime - lastTime;
                    container.scrollLeft += speed * (delta / 16); // Normalize to ~60fps

                    // Infinite scroll loop
                    const scrollWidth = container.scrollWidth / 3;
                    if (container.scrollLeft >= scrollWidth * 2) {
                        container.scrollLeft -= scrollWidth;
                    } else if (container.scrollLeft <= 0) {
                        container.scrollLeft += scrollWidth;
                    }
                }
                lastTime = currentTime;
            } else {
                lastTime = 0;
            }
            animationId = requestAnimationFrame(animate);
        };

        // Initialize scroll position to middle
        container.scrollLeft = container.scrollWidth / 3;
        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [direction, isDragging, items]);

    return (
        <div className="relative">
            {/* Left fade gradient */}
            <div
                className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, rgb(7, 7, 7), transparent)' }}
            />

            {/* Right fade gradient */}
            <div
                className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgb(7, 7, 7), transparent)' }}
            />

            <div
                ref={rowRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab select-none py-2"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleEnd}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {tripleItems.map((item, index) => {
                    const originalIndex = index % items.length;
                    const isLoaded = imageLoadStates[originalIndex];

                    return (
                        <div
                            key={`${direction}-${index}`}
                            className="flex-shrink-0 w-[130px] sm:w-[150px] relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                            onClick={() => handleCardClick(item.link)}
                        >
                            {/* Skeleton loader */}
                            {!isLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
                            )}

                            <Image
                                loader={cfImageLoader}
                                src={item.image}
                                alt={item.text}
                                fill
                                sizes="150px"
                                className={`
                  object-cover transition-transform duration-300
                  group-hover:scale-105
                  ${isLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                                onLoad={() => handleImageLoad(originalIndex)}
                                priority={originalIndex < 3}
                                draggable={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function MobileCardGrid({ items }: MobileCardGridProps) {
    const router = useRouter();

    // Split items into 2 rows
    const row1Items = items.filter((_, i) => i % 2 === 0);
    const row2Items = items.filter((_, i) => i % 2 === 1);

    const handleCardClick = (link?: string) => {
        if (link) {
            router.push(link);
        }
    };

    return (
        <div className="w-full space-y-3 px-0">
            <AutoScrollRow items={row1Items} direction="left" onCardClick={handleCardClick} />
            <AutoScrollRow items={row2Items} direction="right" onCardClick={handleCardClick} />
        </div>
    );
}

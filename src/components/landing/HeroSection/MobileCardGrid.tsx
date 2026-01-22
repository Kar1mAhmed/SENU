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

// Auto-scrolling row component with optimized performance and stable state
function AutoScrollRow({
    items,
    direction = 'left',
    onCardClick
}: {
    items: GalleryItem[];
    direction?: 'left' | 'right';
    onCardClick: (link?: string) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

    // Animation & Drag state - using Refs for everything to prevent re-render resets
    const positionRef = useRef(0);
    const lastTimeRef = useRef(0);
    const animationRef = useRef<number | null>(null);
    const isDraggingRef = useRef(false);
    const dragStartX = useRef(0);
    const dragStartPos = useRef(0);
    const hasDraggedRef = useRef(false);
    const rowWidthRef = useRef(0);

    // Provide some visual state for cursor/active effects if needed, 
    // but keep it separate from the animation loop
    const [isDraggingState, setIsDraggingState] = useState(false);

    // Triple items for infinite scroll
    const tripleItems = [...items, ...items, ...items];

    const handleImageLoad = (index: number) => {
        setImageLoadStates(prev => ({ ...prev, [index]: true }));
    };

    // Touch/Mouse drag handlers
    const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        isDraggingRef.current = true;
        setIsDraggingState(true);
        const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
        dragStartX.current = x;
        dragStartPos.current = positionRef.current;
        hasDraggedRef.current = false;
    }, []);

    const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDraggingRef.current) return;
        const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
        const walk = (x - dragStartX.current) * 1.2; // Slightly faster drag
        if (Math.abs(walk) > 5) hasDraggedRef.current = true;

        positionRef.current = dragStartPos.current + walk;

        if (innerRef.current) {
            innerRef.current.style.transform = `translateX(${positionRef.current}px)`;
        }
    }, []);

    const handleEnd = useCallback(() => {
        isDraggingRef.current = false;
        setIsDraggingState(false);
    }, []);

    const handleCardClick = (link?: string) => {
        if (!hasDraggedRef.current && link) {
            onCardClick(link);
        }
    };

    // Auto-scroll animation using transform - optimized for performance
    useEffect(() => {
        const speed = direction === 'left' ? -0.5 : 0.5;
        let rafId: number | null = null;

        const animate = (currentTime: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;
            const delta = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            if (innerRef.current) {
                // Initialize row width if not set
                if (rowWidthRef.current === 0) {
                    rowWidthRef.current = innerRef.current.scrollWidth / 3;
                    // Initial center position if starting for the first time
                    if (positionRef.current === 0) {
                        positionRef.current = -rowWidthRef.current;
                    }
                }

                // Only apply auto-scroll if NOT dragging
                if (!isDraggingRef.current) {
                    // Normalized to 60fps for consistent speed
                    positionRef.current += speed * (delta / 16.67);

                    // Infinite loop logic
                    const rowWidth = rowWidthRef.current;
                    if (direction === 'left') {
                        if (positionRef.current <= -rowWidth * 2) {
                            positionRef.current += rowWidth;
                        }
                    } else {
                        if (positionRef.current >= 0) {
                            positionRef.current -= rowWidth;
                        }
                    }

                    // Use transform for GPU acceleration
                    innerRef.current.style.transform = `translateX(${positionRef.current}px)`;
                }
            }

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [direction, items.length]); // Items length added as safety, but won't change normally

    return (
        <div className="relative w-full overflow-hidden px-0 touch-pan-y">
            {/* Left fade gradient */}
            <div
                className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, rgb(7, 7, 7) 0%, transparent 100%)' }}
            />

            {/* Right fade gradient */}
            <div
                className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgb(7, 7, 7) 0%, transparent 100%)' }}
            />

            <div
                ref={containerRef}
                className={`select-none py-2 ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                style={{ touchAction: 'pan-y' }}
            >
                <div
                    ref={innerRef}
                    className="flex gap-3 will-change-transform"
                >
                    {tripleItems.map((item, index) => {
                        const originalIndex = index % items.length;
                        const isLoaded = imageLoadStates[originalIndex];

                        return (
                            <div
                                key={`${direction}-${index}`}
                                className="flex-shrink-0 w-[140px] relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform duration-200"
                                onClick={() => handleCardClick(item.link)}
                            >
                                {!isLoaded && (
                                    <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                                )}
                                <Image
                                    loader={cfImageLoader}
                                    src={item.image}
                                    alt={item.text}
                                    fill
                                    sizes="140px"
                                    className={`object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                                    onLoad={() => handleImageLoad(originalIndex)}
                                    priority={originalIndex < 4}
                                    draggable={false}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function MobileCardGrid({ items }: MobileCardGridProps) {
    const router = useRouter();

    // Split items into 2 rows
    const row1Items = items.filter((_, i) => i % 2 === 0);
    const row2Items = items.filter((_, i) => i % 2 === 1);

    const handleCardClick = useCallback((link?: string) => {
        if (link) router.push(link);
    }, [router]);

    return (
        <div className="w-full space-y-4">
            <AutoScrollRow items={row1Items} direction="left" onCardClick={handleCardClick} />
            <AutoScrollRow items={row2Items} direction="right" onCardClick={handleCardClick} />
        </div>
    );
}

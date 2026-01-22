'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import cfImageLoader from '@/lib/imageLoader';

interface GalleryItem {
    image: string;
    text: string;
    link?: string;
}

interface ScrollingCardColumnsProps {
    items: GalleryItem[];
}

// Single column with requestAnimationFrame-based smooth scroll
function CardColumn({
    items,
    direction = 'up',
    onCardClick,
    scrollOffset,
    speedMultiplier = 1
}: {
    items: GalleryItem[];
    direction?: 'up' | 'down';
    onCardClick: (link?: string) => void;
    scrollOffset: number;
    speedMultiplier: number;
}) {
    const columnRef = useRef<HTMLDivElement>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});
    const positionRef = useRef(direction === 'down' ? -33.333 : 0);
    const lastTimeRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    // Triple items for seamless infinite scroll
    const tripleItems = [...items, ...items, ...items];

    const handleImageLoad = (index: number) => {
        setImageLoadStates(prev => ({ ...prev, [index]: true }));
    };

    // Smooth animation loop
    useEffect(() => {
        const speed = direction === 'up' ? -0.015 : 0.015; // Base speed (very slow)

        const animate = (currentTime: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;
            const delta = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            // Apply speed with multiplier (slower when hovered)
            const adjustedSpeed = speed * speedMultiplier * (delta / 16);
            positionRef.current += adjustedSpeed;

            // Handle manual scroll offset
            positionRef.current += scrollOffset * 0.1;

            // Loop around for infinite scroll
            if (direction === 'up') {
                if (positionRef.current <= -33.333) positionRef.current = 0;
                if (positionRef.current > 0) positionRef.current = -33.333;
            } else {
                if (positionRef.current >= 0) positionRef.current = -33.333;
                if (positionRef.current < -33.333) positionRef.current = 0;
            }

            if (columnRef.current) {
                columnRef.current.style.transform = `translateY(${positionRef.current}%)`;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [direction, speedMultiplier, scrollOffset]);

    return (
        <div
            ref={columnRef}
            className="flex flex-col gap-4 will-change-transform"
            style={{ transform: `translateY(${positionRef.current}%)` }}
        >
            {tripleItems.map((item, index) => {
                const originalIndex = index % items.length;
                const isLoaded = imageLoadStates[originalIndex];

                return (
                    <div
                        key={`${direction}-${index}`}
                        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
                        onClick={() => onCardClick(item.link)}
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
                            sizes="(max-width: 768px) 50vw, 200px"
                            className={`
                                object-cover transition-transform duration-300
                                group-hover:scale-105
                                ${isLoaded ? 'opacity-100' : 'opacity-0'}
                            `}
                            onLoad={() => handleImageLoad(originalIndex)}
                            priority={originalIndex < 3}
                            draggable={false}
                        />

                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                );
            })}
        </div>
    );
}

export default function ScrollingCardColumns({ items }: ScrollingCardColumnsProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);

    // Split items into 3 columns
    const column1Items = items.filter((_, i) => i % 3 === 0);
    const column2Items = items.filter((_, i) => i % 3 === 1);
    const column3Items = items.filter((_, i) => i % 3 === 2);

    const handleCardClick = useCallback((link?: string) => {
        if (link) {
            router.push(link);
        }
    }, [router]);

    // Handle mouse wheel for manual scrolling
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        setScrollOffset(e.deltaY * 0.01);
        // Reset offset after applying
        setTimeout(() => setScrollOffset(0), 50);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Speed multiplier: 1 = normal, 0.2 = slow on hover
    const speedMultiplier = isHovered ? 0.25 : 1;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top fade gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-24 lg:h-32 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Bottom fade gradient */}
            <div
                className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Three column grid */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4 h-full px-2">
                <CardColumn
                    items={column1Items}
                    direction="up"
                    onCardClick={handleCardClick}
                    scrollOffset={scrollOffset}
                    speedMultiplier={speedMultiplier}
                />
                <CardColumn
                    items={column2Items}
                    direction="down"
                    onCardClick={handleCardClick}
                    scrollOffset={-scrollOffset}
                    speedMultiplier={speedMultiplier}
                />
                <CardColumn
                    items={column3Items}
                    direction="up"
                    onCardClick={handleCardClick}
                    scrollOffset={scrollOffset}
                    speedMultiplier={speedMultiplier}
                />
            </div>
        </div>
    );
}

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

// Single column with requestAnimationFrame-based smooth scroll + drag support
function CardColumn({
    items,
    direction = 'up',
    onCardClick,
    scrollOffset,
    speedMultiplier = 1,
    isDragging,
    dragDelta
}: {
    items: GalleryItem[];
    direction?: 'up' | 'down';
    onCardClick: (link?: string) => void;
    scrollOffset: number;
    speedMultiplier: number;
    isDragging: boolean;
    dragDelta: number;
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
        const speed = direction === 'up' ? -0.012 : 0.012; // Base speed (very slow & smooth)

        const animate = (currentTime: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;
            const delta = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            // When dragging, only apply drag delta, pause auto-scroll
            if (!isDragging) {
                // Apply auto-scroll speed with multiplier (slower when hovered)
                const adjustedSpeed = speed * speedMultiplier * (delta / 16);
                positionRef.current += adjustedSpeed;

                // Apply mouse wheel scroll offset
                positionRef.current += scrollOffset * 0.05;
            } else {
                // Apply drag delta directly (convert px to % of container)
                positionRef.current += dragDelta * 0.02;
            }

            // Loop around for infinite scroll
            if (direction === 'up') {
                if (positionRef.current <= -33.333) positionRef.current += 33.333;
                if (positionRef.current > 0) positionRef.current -= 33.333;
            } else {
                if (positionRef.current >= 0) positionRef.current -= 33.333;
                if (positionRef.current < -33.333) positionRef.current += 33.333;
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
    }, [direction, speedMultiplier, scrollOffset, isDragging, dragDelta]);

    return (
        <div
            ref={columnRef}
            className="flex flex-col gap-3 lg:gap-4 will-change-transform"
            style={{ transform: `translateY(${positionRef.current}%)` }}
        >
            {tripleItems.map((item, index) => {
                const originalIndex = index % items.length;
                const isLoaded = imageLoadStates[originalIndex];

                return (
                    <div
                        key={`${direction}-${index}`}
                        className="relative w-full aspect-[3/4] rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
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

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [dragDelta, setDragDelta] = useState(0);
    const lastMouseY = useRef(0);
    const hasDragged = useRef(false);

    // Split items into 3 columns
    const column1Items = items.filter((_, i) => i % 3 === 0);
    const column2Items = items.filter((_, i) => i % 3 === 1);
    const column3Items = items.filter((_, i) => i % 3 === 2);

    const handleCardClick = useCallback((link?: string) => {
        // Only navigate if not dragged
        if (!hasDragged.current && link) {
            router.push(link);
        }
    }, [router]);

    // Handle mouse wheel for manual scrolling
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        setScrollOffset(e.deltaY * 0.02);
        setTimeout(() => setScrollOffset(0), 50);
    }, []);

    // Mouse drag handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        lastMouseY.current = e.clientY;
        hasDragged.current = false;
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grabbing';
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const delta = e.clientY - lastMouseY.current;
        if (Math.abs(delta) > 3) {
            hasDragged.current = true;
        }
        setDragDelta(delta);
        lastMouseY.current = e.clientY;
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragDelta(0);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
        }
        // Reset hasDragged after a small delay to allow click to process
        setTimeout(() => {
            hasDragged.current = false;
        }, 100);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Speed multiplier: 1 = normal, 0.25 = slow on hover
    const speedMultiplier = isHovered ? 0.25 : 1;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden cursor-grab select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); handleMouseUp(); }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Top fade gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-16 lg:h-24 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Bottom fade gradient */}
            <div
                className="absolute bottom-0 left-0 right-0 h-16 lg:h-24 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Three column grid */}
            <div className="grid grid-cols-3 gap-2 lg:gap-3 xl:gap-4 h-full px-1 lg:px-2">
                <CardColumn
                    items={column1Items}
                    direction="up"
                    onCardClick={handleCardClick}
                    scrollOffset={scrollOffset}
                    speedMultiplier={speedMultiplier}
                    isDragging={isDragging}
                    dragDelta={dragDelta}
                />
                <CardColumn
                    items={column2Items}
                    direction="down"
                    onCardClick={handleCardClick}
                    scrollOffset={-scrollOffset}
                    speedMultiplier={speedMultiplier}
                    isDragging={isDragging}
                    dragDelta={-dragDelta}
                />
                <CardColumn
                    items={column3Items}
                    direction="up"
                    onCardClick={handleCardClick}
                    scrollOffset={scrollOffset}
                    speedMultiplier={speedMultiplier}
                    isDragging={isDragging}
                    dragDelta={dragDelta}
                />
            </div>
        </div>
    );
}

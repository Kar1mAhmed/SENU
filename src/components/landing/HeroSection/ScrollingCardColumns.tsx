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

// Single column with individual drag scroll support
function CardColumn({
    items,
    direction = 'up',
    onCardClick,
}: {
    items: GalleryItem[];
    direction?: 'up' | 'down';
    onCardClick: (link?: string) => void;
}) {
    const columnRef = useRef<HTMLDivElement>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});
    const positionRef = useRef(direction === 'down' ? -33.333 : 0);
    const lastTimeRef = useRef(0);
    const animationRef = useRef<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Per-column drag state
    const [isDragging, setIsDragging] = useState(false);
    const [dragDelta, setDragDelta] = useState(0);
    const lastMouseY = useRef(0);
    const hasDragged = useRef(false);

    // Triple items for seamless infinite scroll
    const tripleItems = [...items, ...items, ...items];

    const handleImageLoad = (index: number) => {
        setImageLoadStates(prev => ({ ...prev, [index]: true }));
    };

    // Mouse drag handlers for this column only
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        lastMouseY.current = e.clientY;
        hasDragged.current = false;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        e.stopPropagation();
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
        setTimeout(() => {
            hasDragged.current = false;
        }, 100);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (isDragging) {
            handleMouseUp();
        }
    }, [isDragging, handleMouseUp]);

    const handleCardClick = useCallback((link?: string) => {
        if (!hasDragged.current && link) {
            onCardClick(link);
        }
    }, [onCardClick]);

    // Smooth animation loop
    useEffect(() => {
        const speed = direction === 'up' ? -0.012 : 0.012;
        const speedMultiplier = isHovered ? 0.25 : 1;

        const animate = (currentTime: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;
            const delta = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            // When dragging, only apply drag delta, pause auto-scroll
            if (!isDragging) {
                const adjustedSpeed = speed * speedMultiplier * (delta / 16);
                positionRef.current += adjustedSpeed;
            } else {
                // Apply per-column drag delta
                positionRef.current += dragDelta * 0.025;
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
    }, [direction, isHovered, isDragging, dragDelta]);

    return (
        <div
            ref={columnRef}
            className={`flex flex-col gap-3 lg:gap-4 will-change-transform select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ transform: `translateY(${positionRef.current}%)` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseLeave(); setIsHovered(false); }}
            onMouseEnter={() => setIsHovered(true)}
        >
            {tripleItems.map((item, index) => {
                const originalIndex = index % items.length;
                const isLoaded = imageLoadStates[originalIndex];

                return (
                    <div
                        key={`${direction}-${index}`}
                        className="relative w-full aspect-[3/4] rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
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

    // Split items into 3 columns
    const column1Items = items.filter((_, i) => i % 3 === 0);
    const column2Items = items.filter((_, i) => i % 3 === 1);
    const column3Items = items.filter((_, i) => i % 3 === 2);

    const handleCardClick = useCallback((link?: string) => {
        if (link) {
            router.push(link);
        }
    }, [router]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
        >
            {/* Top fade gradient - blends with Navbar */}
            <div
                className="absolute top-0 left-0 right-0 h-24 lg:h-32 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgb(7, 7, 7) 10%, transparent 100%)',
                }}
            />

            {/* Bottom fade gradient - minimal fade over ribbon */}
            <div
                className="absolute bottom-0 left-0 right-0 h-14 lg:h-20 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgb(7, 7, 7) 20%, transparent 100%)',
                }}
            />

            {/* Three column grid - Tighter gaps on laptop (gap-2), wider on big screens (xl:gap-4) */}
            <div className="grid grid-cols-3 gap-2 lg:gap-2 xl:gap-4 h-full px-1 lg:px-2">
                <CardColumn
                    items={column1Items}
                    direction="up"
                    onCardClick={handleCardClick}
                />
                <CardColumn
                    items={column2Items}
                    direction="down"
                    onCardClick={handleCardClick}
                />
                <CardColumn
                    items={column3Items}
                    direction="up"
                    onCardClick={handleCardClick}
                />
            </div>
        </div>
    );
}

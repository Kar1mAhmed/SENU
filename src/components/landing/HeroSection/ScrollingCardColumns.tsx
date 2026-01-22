'use client';
import React, { useRef, useEffect, useState } from 'react';
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

// Single column component
function CardColumn({
    items,
    direction = 'up',
    onCardClick
}: {
    items: GalleryItem[];
    direction?: 'up' | 'down';
    onCardClick: (link?: string) => void;
}) {
    const columnRef = useRef<HTMLDivElement>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

    // Triple items for seamless infinite scroll
    const tripleItems = [...items, ...items, ...items];

    const handleImageLoad = (index: number) => {
        setImageLoadStates(prev => ({ ...prev, [index]: true }));
    };

    return (
        <div
            ref={columnRef}
            className={`
        flex flex-col gap-4
        ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}
      `}
            style={{
                animationDuration: '40s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
            }}
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
                object-cover transition-all duration-500
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

    // Split items into 3 columns
    const column1Items = items.filter((_, i) => i % 3 === 0);
    const column2Items = items.filter((_, i) => i % 3 === 1);
    const column3Items = items.filter((_, i) => i % 3 === 2);

    const handleCardClick = (link?: string) => {
        if (link) {
            router.push(link);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top fade gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Bottom fade gradient */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgb(7, 7, 7) 0%, transparent 100%)',
                }}
            />

            {/* Three column grid */}
            <div
                className={`
          grid grid-cols-3 gap-4 h-full px-2
          transition-all duration-700 ease-out
          ${isHovered ? '[&_.animate-scroll-up]:animation-duration-[120s] [&_.animate-scroll-down]:animation-duration-[120s]' : ''}
        `}
                style={{
                    // Use CSS custom property for animation speed control
                    ['--scroll-duration' as string]: isHovered ? '120s' : '40s',
                }}
            >
                <CardColumn items={column1Items} direction="up" onCardClick={handleCardClick} />
                <CardColumn items={column2Items} direction="down" onCardClick={handleCardClick} />
                <CardColumn items={column3Items} direction="up" onCardClick={handleCardClick} />
            </div>

            {/* Inline keyframes for scrolling */}
            <style jsx global>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
        
        @keyframes scroll-down {
          0% {
            transform: translateY(-33.333%);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .animate-scroll-up {
          animation: scroll-up var(--scroll-duration, 40s) linear infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down var(--scroll-duration, 40s) linear infinite;
        }
        
        /* Hover slowdown effect on parent */
        .group-hover-slow .animate-scroll-up,
        .group-hover-slow .animate-scroll-down {
          animation-duration: 120s !important;
        }
      `}</style>
        </div>
    );
}

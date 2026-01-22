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

interface MobileCardGridProps {
    items: GalleryItem[];
}

export default function MobileCardGrid({ items }: MobileCardGridProps) {
    const router = useRouter();
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeRow, setActiveRow] = useState<HTMLDivElement | null>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

    // Split items into 2 rows
    const row1Items = items.filter((_, i) => i % 2 === 0);
    const row2Items = items.filter((_, i) => i % 2 === 1);

    // Triple items for infinite scroll
    const tripleRow1 = [...row1Items, ...row1Items, ...row1Items];
    const tripleRow2 = [...row2Items, ...row2Items, ...row2Items];

    const handleImageLoad = (key: string) => {
        setImageLoadStates(prev => ({ ...prev, [key]: true }));
    };

    const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return;
        setIsDragging(true);
        setActiveRow(ref.current);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const handleTouchStart = (e: React.TouchEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return;
        setIsDragging(true);
        setActiveRow(ref.current);
        setStartX(e.touches[0].pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !activeRow) return;
        e.preventDefault();
        const x = e.pageX - activeRow.offsetLeft;
        const walk = (x - startX) * 1.5;
        activeRow.scrollLeft = scrollLeft - walk;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !activeRow) return;
        const x = e.touches[0].pageX - activeRow.offsetLeft;
        const walk = (x - startX) * 1.5;
        activeRow.scrollLeft = scrollLeft - walk;
    };

    const handleEnd = () => {
        setIsDragging(false);
        setActiveRow(null);
    };

    const handleCardClick = (link?: string) => {
        if (!isDragging && link) {
            router.push(link);
        }
    };

    // Infinite scroll handler
    useEffect(() => {
        const setupInfiniteScroll = (container: HTMLDivElement | null) => {
            if (!container) return () => { };

            const handleScroll = () => {
                const scrollWidth = container.scrollWidth / 3;
                const currentScroll = container.scrollLeft;

                if (currentScroll >= scrollWidth * 2) {
                    container.scrollLeft = currentScroll - scrollWidth;
                } else if (currentScroll <= 0) {
                    container.scrollLeft = scrollWidth + currentScroll;
                }
            };

            container.addEventListener('scroll', handleScroll);

            // Start in the middle
            setTimeout(() => {
                container.scrollLeft = container.scrollWidth / 3;
            }, 100);

            return () => container.removeEventListener('scroll', handleScroll);
        };

        const cleanup1 = setupInfiniteScroll(row1Ref.current);
        const cleanup2 = setupInfiniteScroll(row2Ref.current);

        return () => {
            cleanup1();
            cleanup2();
        };
    }, [items]);

    const renderRow = (
        rowItems: GalleryItem[],
        tripleItems: GalleryItem[],
        ref: React.RefObject<HTMLDivElement | null>,
        rowKey: string
    ) => (
        <div
            ref={ref}
            className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none py-2"
            onMouseDown={(e) => handleMouseDown(e, ref)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleTouchStart(e, ref)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            {tripleItems.map((item, index) => {
                const originalIndex = index % rowItems.length;
                const imageKey = `${rowKey}-${originalIndex}`;
                const isLoaded = imageLoadStates[imageKey];

                return (
                    <div
                        key={`${rowKey}-${index}`}
                        className="flex-shrink-0 w-[140px] sm:w-[160px] relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
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
                            sizes="160px"
                            className={`
                object-cover transition-all duration-300
                group-hover:scale-105
                ${isLoaded ? 'opacity-100' : 'opacity-0'}
              `}
                            onLoad={() => handleImageLoad(imageKey)}
                            priority={originalIndex < 2}
                            draggable={false}
                        />
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="w-full space-y-3">
            {renderRow(row1Items, tripleRow1, row1Ref, 'row1')}
            {renderRow(row2Items, tripleRow2, row2Ref, 'row2')}
        </div>
    );
}

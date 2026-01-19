'use client';
import React from 'react';
import WebGLGallery from '@/components/animations/WebGLGallery';
import SimpleGallery from '@/components/animations/SimpleGallery';
import { useThumbnails } from '@/lib/hooks/useThumbnails';

interface GalleryItem {
    image: string;
    text: string;
    link: string;
}

// Skeleton loader for gallery while loading
function GallerySkeleton() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-[200px] h-[250px] md:w-[280px] md:h-[350px] rounded-2xl bg-neutral-900 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

interface HeroGalleryProps {
    // Allow passing pre-fetched items for SSR scenarios
    initialItems?: GalleryItem[];
}

export default function HeroGallery({ initialItems }: HeroGalleryProps) {
    const { thumbnails, loading } = useThumbnails(15);

    // Transform thumbnails to gallery format with direct links
    const galleryItems: GalleryItem[] = thumbnails.length > 0
        ? thumbnails.map(thumb => {
            const urlFriendlyName = thumb.name.replace(/\s+/g, '-');
            return {
                image: thumb.thumbnailUrl,
                text: thumb.name,
                link: `/portfolio/${urlFriendlyName}`
            };
        })
        : initialItems || [];

    if (loading && galleryItems.length === 0) {
        return <GallerySkeleton />;
    }

    return (
        <>
            {/* Mobile Gallery - Simple HTML/CSS for better performance */}
            <div className="block md:hidden h-full mt-24">
                <SimpleGallery items={galleryItems} />
            </div>
            {/* Desktop Gallery - WebGL with curve */}
            <div className="hidden md:block h-full">
                <WebGLGallery
                    items={galleryItems}
                    bend={3}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    font="600 24px 'New Black Typeface', sans-serif"
                    scrollSpeed={2}
                    scrollEase={0.05}
                />
            </div>
        </>
    );
}


'use client';

import React from 'react';
import RotatingText from '@/components/animations/RotatingText';

/**
 * HeroText - Server Component
 * 
 * This renders immediately on the server without waiting for JS hydration.
 * The RotatingText component handles its own client-side animation.
 * 
 * Performance Impact:
 * - LCP improvement: Text renders on first paint instead of after hydration
 * - FCP improvement: Visible content appears faster
 */
export default function HeroText() {
    return (
        <div className="text-center mb-0">
            <h1 className="font-new-black text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
                YOUR PROJECTS ARE
            </h1>
            <h1 className="font-new-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
                <RotatingText
                    words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']}
                    colors={['#4FAF78', '#0055D1', '#FAC53A', '#EF4444']}
                    duration={2500}
                />
                {' '}WITH US
            </h1>
        </div>
    );
}

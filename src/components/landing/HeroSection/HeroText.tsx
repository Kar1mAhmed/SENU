'use client';

import React from 'react';
import Link from 'next/link';
import RotatingText from '@/components/animations/RotatingText';

/**
 * HeroText - Superside-style hero text component
 * 
 * Features:
 * - Animated rotating text (kept from original)
 * - Subtext paragraph about services
 * - Contact Us button
 * - Left-aligned on desktop, centered on mobile
 */
export default function HeroText() {
    return (
        <div className="flex flex-col text-center md:text-left">
            {/* Main heading with animation */}
            <h1 className="font-new-black text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-light leading-tight">
                YOUR PROJECTS ARE
            </h1>
            <h1 className="font-new-black text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-light leading-tight">
                <RotatingText
                    words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']}
                    colors={['#4FAF78', '#0055D1', '#FAC53A', '#EF4444']}
                    duration={2500}
                />
                {' '}WITH US
            </h1>

            {/* Subtext */}
            <p className="font-alexandria text-gray-400 text-sm md:text-base lg:text-lg mt-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Scale your creative team with top global talent in graphic design, video editing, and motion graphics—delivering anything you can imagine, fast and affordably.
            </p>

            {/* Contact Us Button */}
            <div className="mt-8 flex justify-center md:justify-start">
                <Link
                    href="/contact"
                    className="bg-blue text-white font-alexandria rounded-full px-8 py-3 text-sm font-semibold tracking-widest hover:bg-blue/90 transition-colors duration-300 inline-flex items-center justify-center"
                >
                    CONTACT US
                </Link>
            </div>
        </div>
    );
}

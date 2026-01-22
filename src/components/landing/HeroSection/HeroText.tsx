'use client';

import React from 'react';
import Link from 'next/link';
import RotatingText from '@/components/animations/RotatingText';

/**
 * HeroText - Superside-style hero text component
 */
export default function HeroText() {
    return (
        <div className="flex flex-col text-center md:text-left">
            {/* Desktop: Single line "YOUR PROJECTS ARE", then rotating text, then "WITH US" */}
            <div className="hidden md:block">
                <h1 className="font-new-black text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white font-light leading-tight whitespace-nowrap">
                    YOUR PROJECTS ARE
                </h1>
                <h1 className="font-new-black text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white font-light leading-tight">
                    <RotatingText
                        words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']}
                        colors={['#4FAF78', '#0055D1', '#FAC53A', '#EF4444']}
                        duration={2500}
                    />
                </h1>
                <h1 className="font-new-black text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white font-light leading-tight">
                    WITH US
                </h1>
            </div>

            {/* Mobile: Original layout */}
            <div className="md:hidden">
                <h1 className="font-new-black text-3xl sm:text-4xl text-white font-light leading-tight">
                    YOUR PROJECTS ARE
                </h1>
                <h1 className="font-new-black text-2xl sm:text-3xl text-white font-light leading-tight">
                    <RotatingText
                        words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']}
                        colors={['#4FAF78', '#0055D1', '#FAC53A', '#EF4444']}
                        duration={2500}
                    />
                    {' '}WITH US
                </h1>
            </div>

            {/* Subtext - smaller, direct CTA */}
            <p className="font-alexandria text-gray-400 text-xs md:text-sm mt-4 md:mt-6 max-w-md mx-auto md:mx-0 leading-relaxed">
                We're a creative team specializing in video editing, motion graphics, and graphic design—bringing your vision to life.
            </p>

            {/* Contact Us Button - centered on desktop */}
            <div className="mt-6 md:mt-8 flex justify-center">
                <Link
                    href="/contact"
                    className="bg-blue text-white font-alexandria rounded-full px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-semibold tracking-widest hover:bg-blue/90 transition-colors duration-300 inline-flex items-center justify-center"
                >
                    CONTACT US
                </Link>
            </div>
        </div>
    );
}

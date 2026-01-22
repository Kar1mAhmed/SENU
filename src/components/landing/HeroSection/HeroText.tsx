'use client';

import React from 'react';
import Link from 'next/link';
import RotatingText from '@/components/animations/RotatingText';

/**
 * HeroText - Superside-style hero text component
 * Simplified layout to avoid production hydration issues
 */
export default function HeroText() {
    return (
        <div className="flex flex-col text-center md:text-left">
            {/* Main heading - responsive sizing */}
            <h1 className="font-new-black text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white font-light leading-tight">
                YOUR PROJECTS ARE
            </h1>
            <h1 className="font-new-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white font-light leading-tight">
                <RotatingText
                    words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']}
                    colors={['#4FAF78', '#0055D1', '#FAC53A', '#EF4444']}
                    duration={2500}
                />
            </h1>
            <h1 className="font-new-black text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white font-light leading-tight">
                WITH US
            </h1>

            {/* Subtext */}
            <p className="font-alexandria text-gray-400 text-xs md:text-sm mt-4 md:mt-6 max-w-md mx-auto md:mx-0 leading-relaxed">
                We're a creative team specializing in video editing, motion graphics, and graphic design—bringing your vision to life.
            </p>

            {/* Contact Us Button */}
            <div className="mt-6 md:mt-8 flex justify-center md:justify-start">
                <Link
                    href="/contact"
                    className="bg-blue text-white font-alexandria rounded-full px-8 md:px-10 py-3 md:py-4 text-sm md:text-base font-semibold tracking-widest hover:bg-blue/90 transition-colors duration-300 inline-flex items-center justify-center"
                >
                    CONTACT US
                </Link>
            </div>
        </div>
    );
}

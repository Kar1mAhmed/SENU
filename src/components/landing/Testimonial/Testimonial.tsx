'use client';

import { useState, useRef, useEffect } from 'react';
import { mockTestimonials } from '@/lib/mock-data';
import { WithClassName } from '@/lib/types';
import TestimonialCard from './TestimonialCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface ClientsSectionProps extends WithClassName { }

export default function ClientsSection({ className = '' }: ClientsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(mockTestimonials.length); // Start at middle
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    console.log('🎪 ClientsSection rendering with', mockTestimonials.length, 'testimonials, current index:', currentIndex);

    // Create infinite array: [...original, ...original, ...original]
    const infiniteTestimonials = [...mockTestimonials, ...mockTestimonials, ...mockTestimonials];

    // Card dimensions
    const getCardWidth = () => {
        // Default to mobile width during SSR, will be corrected on client
        if (typeof window === 'undefined') return 286;
        return window.innerWidth >= 1024 ? 360 : 286;
    };

    useEffect(() => {
        // Reset position when reaching boundaries
        if (currentIndex <= 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(mockTestimonials.length);
                setIsTransitioning(false);
            }, 0);
        } else if (currentIndex >= infiniteTestimonials.length - mockTestimonials.length) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(mockTestimonials.length);
                setIsTransitioning(false);
            }, 0);
        }
    }, [currentIndex, infiniteTestimonials.length]);

    const handlePrevious = () => {
        if (isTransitioning) return;
        console.log('⬅️ Previous button clicked, moving from index:', currentIndex);
        setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        console.log('➡️ Next button clicked, moving from index:', currentIndex);
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <section className={`py-16  ${className}`} >
            {/* Header with Title and Navigation - Full Width like Navbar */}
            <div className="flex justify-center w-full px-4 mb-12">
                <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                    <div className="flex justify-between items-center">
                        {/* Title */}
                        <div>
                            <h2 className="font-new-black text-3xl md:text-5xl lg:text-6xl font-light text-white">
                                WHAT OUR{' '}
                                <br />
                                <span className="text-yellow-400">CLIENTS</span>{' '}
                                SAY
                            </h2>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-4">
                            <button
                                onClick={handlePrevious}
                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group"
                                aria-label="Previous testimonial"
                            >
                                <FaArrowLeft />
                            </button>

                            <button
                                onClick={handleNext}
                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group"
                                aria-label="Next testimonial"
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Cards - Full Width */}
            <div
                ref={containerRef}
                className="overflow-hidden w-full"
            >
                <div
                    className={`flex ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
                    style={{
                        transform: `translateX(-${currentIndex * getCardWidth()}px)`,
                        width: `${infiniteTestimonials.length * getCardWidth()}px`
                    }}
                >
                    {infiniteTestimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={`${testimonial.id}-${index}`}
                            testimonial={testimonial}
                            className=""
                        />
                    ))}
                </div>
            </div>

            <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            </div>
        </section>
    );
}
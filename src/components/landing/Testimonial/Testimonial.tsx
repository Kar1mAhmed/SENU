'use client';

import { useState, useRef, useEffect } from 'react';
import { mockTestimonials } from '@/lib/mock-data';
import { WithClassName } from '@/lib/types';
import TestimonialCard from './TestimonialCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface ClientsSectionProps extends WithClassName { }

export default function ClientsSection({ className = '' }: ClientsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [displayIndex, setDisplayIndex] = useState(0);

    console.log('🎪 ClientsSection rendering with', mockTestimonials.length, 'testimonials, current index:', currentIndex);

    // Create infinite array: [...original, ...original, ...original]
    const infiniteTestimonials = [...mockTestimonials, ...mockTestimonials, ...mockTestimonials];

    // Get number of cards to show per screen
    const getCardsPerScreen = () => {
        if (typeof window === 'undefined') return 4;
        if (window.innerWidth < 768) return 1; // Mobile: 1 card
        if (window.innerWidth < 1024) return 2; // Tablet: 2 cards
        return 4; // Desktop: 4 cards
    };

    // Calculate current page based on cards per screen
    const getCurrentPage = () => {
        const cardsPerScreen = getCardsPerScreen();
        return Math.floor(currentIndex / cardsPerScreen);
    };

    // Get testimonials for current page
    const getCurrentTestimonials = () => {
        const cardsPerScreen = getCardsPerScreen();
        const startIndex = displayIndex % mockTestimonials.length;
        const testimonials = [];
        
        for (let i = 0; i < cardsPerScreen; i++) {
            const index = (startIndex + i) % mockTestimonials.length;
            testimonials.push(mockTestimonials[index]);
        }
        
        return testimonials;
    };

    // Create extended array for smooth transitions
    const getExtendedTestimonials = () => {
        const cardsPerScreen = getCardsPerScreen();
        const extended = [];
        
        // Create enough copies for smooth infinite scrolling
        for (let copy = 0; copy < 3; copy++) {
            for (let i = 0; i < mockTestimonials.length; i += cardsPerScreen) {
                const pageTestimonials = [];
                for (let j = 0; j < cardsPerScreen; j++) {
                    const index = (i + j) % mockTestimonials.length;
                    pageTestimonials.push(mockTestimonials[index]);
                }
                extended.push(pageTestimonials);
            }
        }
        
        return extended;
    };

    const getContainerWidth = () => {
        if (typeof window === 'undefined') return 1280;
        return window.innerWidth;
    };

    // Touch handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        console.log('📱 Testimonial touch gesture:', { distance, isLeftSwipe, isRightSwipe });

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrevious();
        }
    };

    useEffect(() => {
        // Handle infinite scroll reset
        const extendedPages = getExtendedTestimonials();
        const middleStart = Math.floor(extendedPages.length / 3);
        
        if (currentIndex < 0) {
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(extendedPages.length - 1);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 500);
        } else if (currentIndex >= extendedPages.length) {
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(0);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 500);
        }
        
        // Update display index for content
        setDisplayIndex(currentIndex % mockTestimonials.length);
    }, [currentIndex]);

    const handlePrevious = () => {
        if (isTransitioning) return;
        console.log('⬅️ Previous page clicked');
        setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        console.log('➡️ Next page clicked');
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <section className={`py-16  ${className}`} >
            {/* Header with Title and Navigation - Full Width like Navbar */}
            <div className="flex justify-center w-full px-8 mb-12">
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

            {/* Testimonial Cards - Smooth Scrolling Container */}
            <div className="w-full overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div 
                    className={`flex ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
                    style={{
                        transform: `translateX(-${currentIndex * getContainerWidth()}px)`,
                        width: `${getExtendedTestimonials().length * getContainerWidth()}px`
                    }}
                >
                    {getExtendedTestimonials().map((pageTestimonials, pageIndex) => (
                        <div 
                            key={pageIndex}
                            className="w-full flex-shrink-0"
                            style={{ width: `${getContainerWidth()}px` }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-0 h-full w-full">
                                {pageTestimonials.map((testimonial, index) => (
                                    <div
                                        key={`${testimonial.id}-${pageIndex}-${index}`}
                                        className="flex justify-center items-center px-3 md:px-4 lg:px-6"
                                    >
                                        <TestimonialCard
                                            testimonial={testimonial}
                                            className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            </div>
        </section>
    );
}
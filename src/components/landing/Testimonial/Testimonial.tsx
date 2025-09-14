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
    const [cardsPerScreen, setCardsPerScreen] = useState(1);
    const [isClient, setIsClient] = useState(false);

    console.log('🎪 ClientsSection rendering with', mockTestimonials.length, 'testimonials, current index:', currentIndex);

    // Get number of cards to show per screen based on breakpoints
    const getCardsPerScreen = () => {
        if (typeof window === 'undefined') return 1;
        if (window.innerWidth < 768) return 1; // Mobile: 1 card
        if (window.innerWidth < 1024) return 2; // Tablet: 2 cards  
        return 4; // Desktop: 4 cards
    };

    // Get testimonials for current view
    const getCurrentTestimonials = () => {
        const testimonials = [];
        for (let i = 0; i < cardsPerScreen; i++) {
            const index = (currentIndex + i) % mockTestimonials.length;
            testimonials.push(mockTestimonials[index]);
        }
        return testimonials;
    };

    // Initialize client-side state
    useEffect(() => {
        setIsClient(true);
        setCardsPerScreen(getCardsPerScreen());

        const updateCardsPerScreen = () => {
            setCardsPerScreen(getCardsPerScreen());
        };

        window.addEventListener('resize', updateCardsPerScreen);
        return () => window.removeEventListener('resize', updateCardsPerScreen);
    }, []);

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

        console.log('📱 Touch swipe detected:', { distance, isLeftSwipe, isRightSwipe });

        if (isLeftSwipe && !isTransitioning) {
            handleNext();
        } else if (isRightSwipe && !isTransitioning) {
            handlePrevious();
        }
    };

    const handlePrevious = () => {
        if (isTransitioning) return;
        console.log('⬅️ Previous testimonial clicked');
        setIsTransitioning(true);
        setCurrentIndex(prev => {
            const newIndex = prev - 1;
            return newIndex < 0 ? mockTestimonials.length - 1 : newIndex;
        });
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        console.log('➡️ Next testimonial clicked');
        setIsTransitioning(true);
        setCurrentIndex(prev => (prev + 1) % mockTestimonials.length);
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const currentTestimonials = getCurrentTestimonials();

    // Don't render until client-side to avoid hydration mismatch
    if (!isClient) {
        return (
            <section className={`py-16 ${className}`}>
                {/* Header */}
                <div className="flex justify-center w-full px-4 md:px-8 mb-12">
                    <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-new-black text-3xl md:text-5xl lg:text-6xl font-light text-white">
                                    WHAT OUR{' '}
                                    <br />
                                    <span className="text-yellow-400">CLIENTS</span>{' '}
                                    SAY
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                <button className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                                    <FaArrowLeft />
                                </button>
                                <button className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Loading placeholder */}
                <div className="w-full h-80 flex items-center justify-center">
                    <div className="text-white/50">Loading testimonials...</div>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 ${className}`}>
            {/* Header with Title and Navigation - Full Width like Navbar */}
            <div className="flex justify-center w-full px-4 md:px-8 mb-12">
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
                                disabled={isTransitioning}
                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                                aria-label="Previous testimonials"
                            >
                                <FaArrowLeft className="group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={isTransitioning}
                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                                aria-label="Next testimonials"
                            >
                                <FaArrowRight className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Cards - Smooth Scrolling Carousel */}
            <div 
                className="w-full overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div 
                    ref={containerRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / cardsPerScreen}%)`
                    }}
                >
                    {/* Render all testimonials in a continuous row */}
                    {mockTestimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="flex-shrink-0 flex justify-center items-center px-3 md:px-4 lg:px-6"
                            style={{
                                width: `${100 / cardsPerScreen}%`
                            }}
                        >
                            <TestimonialCard
                                testimonial={testimonial}
                                className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: mockTestimonials.length }).map((_, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isTransitioning) {
                                    setIsTransitioning(true);
                                    setCurrentIndex(index);
                                    setTimeout(() => setIsTransitioning(false), 500);
                                }
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                isActive 
                                    ? 'bg-yellow-400 w-6' 
                                    : 'bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    );
                })}
            </div>

            <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            </div>
        </section>
    );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { mockTestimonials } from '@/lib/mock-data';
import { WithClassName } from '@/lib/types';
import TestimonialCard from './TestimonialCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface ClientsSectionProps extends WithClassName { }

export default function ClientsSection({ className = '' }: ClientsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(mockTestimonials.length); // Start in middle for infinite scroll
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [cardsPerScreen, setCardsPerScreen] = useState(4);

    console.log('🎪 ClientsSection rendering with', mockTestimonials.length, 'testimonials, current index:', currentIndex);

    // Create infinite array: [...original, ...original, ...original] for smooth infinite scrolling
    const infiniteTestimonials = [...mockTestimonials, ...mockTestimonials, ...mockTestimonials];

    // Get number of cards to show per screen based on breakpoints
    const getCardsPerScreen = () => {
        if (typeof window === 'undefined') return 4;
        if (window.innerWidth < 768) return 1; // Mobile: 1 card
        if (window.innerWidth < 1024) return 2; // Tablet: 2 cards  
        return 4; // Desktop: 4 cards
    };

    // Get container width for smooth scrolling calculations
    const getContainerWidth = () => {
        if (typeof window === 'undefined') return 1280;
        return window.innerWidth;
    };

    // Get testimonials for current page
    const getCurrentPageTestimonials = () => {
        const startIndex = currentIndex;
        const testimonials = [];
        
        for (let i = 0; i < cardsPerScreen; i++) {
            const index = (startIndex + i) % infiniteTestimonials.length;
            testimonials.push(infiniteTestimonials[index]);
        }
        
        return testimonials;
    };

    // Create pages for smooth scrolling
    const createInfinitePages = () => {
        const pages = [];
        const totalPages = Math.ceil(infiniteTestimonials.length / cardsPerScreen);
        
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const pageTestimonials = [];
            for (let i = 0; i < cardsPerScreen; i++) {
                const testimonialIndex = (pageIndex * cardsPerScreen + i) % infiniteTestimonials.length;
                pageTestimonials.push(infiniteTestimonials[testimonialIndex]);
            }
            pages.push(pageTestimonials);
        }
        
        return pages;
    };

    const infinitePages = createInfinitePages();
    const currentPageIndex = Math.floor(currentIndex / cardsPerScreen);

    useEffect(() => {
        const updateCardsPerScreen = () => {
            setCardsPerScreen(getCardsPerScreen());
        };

        updateCardsPerScreen();
        window.addEventListener('resize', updateCardsPerScreen);
        return () => window.removeEventListener('resize', updateCardsPerScreen);
    }, []);

    useEffect(() => {
        // Handle infinite scroll reset - smooth transition back to middle
        const totalPages = infinitePages.length;
        const middlePageStart = Math.floor(totalPages / 3);
        
        if (currentPageIndex <= 0) {
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(middlePageStart * cardsPerScreen);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 300);
        } else if (currentPageIndex >= totalPages - 1) {
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(middlePageStart * cardsPerScreen);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 300);
        }
    }, [currentPageIndex, infinitePages.length, cardsPerScreen]);

    // Touch handlers for smooth touch experience
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
        console.log('⬅️ Previous page clicked');
        setCurrentIndex(prev => prev - cardsPerScreen);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        console.log('➡️ Next page clicked');
        setCurrentIndex(prev => prev + cardsPerScreen);
    };

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

            {/* Testimonial Cards - Smooth Scrolling Container */}
            <div 
                className="w-full overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div 
                    ref={containerRef}
                    className={`flex ${isTransitioning ? '' : 'transition-transform duration-500 ease-out'}`}
                    style={{
                        transform: `translateX(-${currentPageIndex * getContainerWidth()}px)`,
                        width: `${infinitePages.length * getContainerWidth()}px`
                    }}
                >
                    {infinitePages.map((pageTestimonials, pageIndex) => (
                        <div 
                            key={pageIndex}
                            className="w-full flex-shrink-0"
                            style={{ width: `${getContainerWidth()}px` }}
                        >
                            {/* Grid Layout - Aligned with BackgroundGrid like Impact Section */}
                            <div className="w-full h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-0 h-full w-full">
                                    {pageTestimonials.map((testimonial, cardIndex) => (
                                        <div
                                            key={`${testimonial.id}-${pageIndex}-${cardIndex}`}
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
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots (Optional) */}
            <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: Math.ceil(mockTestimonials.length / cardsPerScreen) }).map((_, index) => {
                    const actualPageIndex = (currentPageIndex % Math.ceil(mockTestimonials.length / cardsPerScreen));
                    const isActive = index === actualPageIndex;
                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(mockTestimonials.length + (index * cardsPerScreen))}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                isActive 
                                    ? 'bg-yellow-400 w-6' 
                                    : 'bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to testimonial page ${index + 1}`}
                        />
                    );
                })}
            </div>

            <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            </div>
        </section>
    );
}
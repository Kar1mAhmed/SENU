'use client';
import React, { useState, useRef, useEffect } from 'react';
import { mockTeamMembers } from '@/lib/mock-data';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const TeamSection = () => {
  console.log('👥 Team section rendering - meet the creative minds behind the magic!');
  
  const [currentIndex, setCurrentIndex] = useState(mockTeamMembers.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cardWidth, setCardWidth] = useState(340);
  const [gap, setGap] = useState(16);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Create infinite array
  const infiniteTeamMembers = [...mockTeamMembers, ...mockTeamMembers, ...mockTeamMembers];

  // Card dimensions functions
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 340;
    return window.innerWidth >= 1024 ? 770 : 340;
  };

  const getGap = () => {
    if (typeof window === 'undefined') return 16;
    return window.innerWidth >= 1024 ? 32 : 16;
  };

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setCardWidth(getCardWidth());
    setGap(getGap());

    const updateDimensions = () => {
      setCardWidth(getCardWidth());
      setGap(getGap());
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
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

    console.log('📱 Touch gesture detected:', { distance, isLeftSwipe, isRightSwipe });

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  useEffect(() => {
    if (!isClient) return;
    
    // Reset position when reaching boundaries
    if (currentIndex <= 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(mockTeamMembers.length);
        setIsTransitioning(false);
      }, 0);
    } else if (currentIndex >= infiniteTeamMembers.length - mockTeamMembers.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(mockTeamMembers.length);
        setIsTransitioning(false);
      }, 0);
    }
  }, [currentIndex, infiniteTeamMembers.length, isClient]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setCurrentIndex(prev => prev + 1);
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <section className="w-full px-4 lg:px-0 mb-32">
        <div className="max-w-[1280px] mx-auto mt-4 md:mt-32">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-new-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold">
              THE <span className="text-blue">CREATIVE MINDS</span> THAT POWER OUR{' '}
              <span className="text-blue">PROJECTS</span>
            </h2>
            
            {/* Navigation Arrows */}
            <div className="flex items-center gap-4 mt-32">
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <FaArrowLeft className="text-blue" />
              </button>
              
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <FaArrowRight className="text-blue" />
              </button>
            </div>
          </div>

          {/* Loading placeholder */}
          <div className="w-full h-80 flex items-center justify-center">
            <div className="text-white/50">Loading team members...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 lg:px-0 mb-32">
      <div className="max-w-[1280px] mx-auto mt-4 md:mt-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-new-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold">
            THE <span className="text-blue">CREATIVE MINDS</span> THAT POWER OUR{' '}
            <span className="text-blue">PROJECTS</span>
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 mt-32">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors duration-300"
            >
              <FaArrowLeft className="text-blue" />
            </button>
            
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors duration-300"
            >
              <FaArrowRight className="text-blue" />
            </button>
          </div>
        </div>

        {/* Team Member Cards - Scrollable */}
        <div
          ref={containerRef}
          className="overflow-hidden w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`flex gap-4 lg:gap-8 ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              width: `${infiniteTeamMembers.length * (cardWidth + gap)}px`
            }}
          >
            {infiniteTeamMembers.map((member, index) => {
              const colors = ['bg-blue', 'bg-orange', 'bg-green', 'bg-purple'];
              const cardColor = colors[member.id === '1' ? 0 : member.id === '2' ? 1 : member.id === '3' ? 2 : 3];
              
              return (
                <div
                  key={`${member.id}-${index}`}
                  className={`relative ${cardColor} rounded-lg overflow-hidden flex-shrink-0`}
                  style={{
                    width: `${cardWidth}px`,
                    height: cardWidth >= 770 ? '460px' : '305px'
                  }}
                >
                  <div className="grid grid-cols-2 h-full">
                    {/* Left Section - Image */}
                    <div className="relative">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Right Section - Info */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center relative">
                      {/* Grid Background */}
                      <div 
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                          `,
                          backgroundSize: '30px 30px'
                        }}
                      />
                      
                      <h3 className="font-new-black text-sm lg:text-3xl font-bold text-white relative z-10">
                        {member.name}
                      </h3>
                      <p className="font-alexandria text-xs lg:text-lg text-yellow font-light relative z-10 mb-2 lg:mb-8">
                        {member.position}
                      </p>
                      <p className="font-alexandria text-xs lg:text-base text-white/80 leading-relaxed relative z-10">
                        {member.description}
                      </p>
                    </div>

                    {/* Character Sidebar - Between sections */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-4 lg:w-8 xl:w-10 h-auto bg-blue-soft rounded-full flex flex-col items-center justify-center gap-1 lg:gap-2 bg-opacity-90">
                        {member.characters.map((char, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center"
                          >
                            <span className="font-new-black text-white text-xs lg:text-sm font-bold">
                              {char}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { mockTeamMembers } from '@/lib/mock-data';
import Image from 'next/image';

const TeamSection = () => {
  console.log('👥 Team section rendering - meet the creative minds behind the magic!');
  
  const [currentIndex, setCurrentIndex] = useState(mockTeamMembers.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create infinite array
  const infiniteTeamMembers = [...mockTeamMembers, ...mockTeamMembers, ...mockTeamMembers];

  // Card dimensions
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 330;
    return window.innerWidth >= 1024 ? 770 : 330;
  };

  useEffect(() => {
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
  }, [currentIndex, infiniteTeamMembers.length]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <section className="w-full px-4 lg:px-0 py-20 mb-32">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-new-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold">
            THE <span className="text-blue">CREATIVE MINDS</span> THAT POWER OUR{' '}
            <span className="text-blue">PROJECTS</span>
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Team Member Cards - Scrollable */}
        <div
          ref={containerRef}
          className="overflow-hidden w-full"
        >
          <div
            className={`flex gap-8 ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
            style={{
              transform: `translateX(-${currentIndex * (getCardWidth() + 32)}px)`,
              width: `${infiniteTeamMembers.length * (getCardWidth() + 32)}px`
            }}
          >
            {infiniteTeamMembers.map((member, index) => {
              const colors = ['bg-blue', 'bg-orange', 'bg-green', 'bg-purple'];
              const cardColor = colors[member.id === '1' ? 0 : member.id === '2' ? 1 : member.id === '3' ? 2 : 3];
              
              return (
                <div
                  key={`${member.id}-${index}`}
                  className={`relative ${cardColor} rounded-lg overflow-hidden flex-shrink-0 w-[330px] h-[305px] lg:w-[770px] lg:h-[460px]`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left Section - Info */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center relative">
                      {/* Grid Background */}
                      <div 
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '30px 30px'
                        }}
                      />
                      
                      <h3 className="font-new-black text-xl lg:text-3xl font-bold text-white relative z-10">
                        {member.name}
                      </h3>
                      <p className="font-alexandria text-sm lg:text-lg text-yellow font-light relative z-10 mb-8">
                        {member.position}
                      </p>
                      <p className="font-alexandria text-xs lg:text-base text-white/80 leading-relaxed relative z-10">
                        {member.description}
                      </p>
                    </div>

                    {/* Right Section - Image */}
                    <div className="relative">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Character Sidebar - Between sections */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-auto  bg-blue-soft rounded-full flex flex-col items-center justify-center gap-1 lg:gap-2 bg-opacity-90">
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

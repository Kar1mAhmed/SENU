'use client';
import React from 'react';
import Image from 'next/image';
import CharacterSidebar from '../CharacterSidebar';
import { AboutCard } from '@/lib/types';

interface QuestionCardProps {
  card: AboutCard;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ card, index }) => {
  console.log(`🃏 Question card ${index + 1} rendering - dropping knowledge bombs!`);

  return (
    <div className="relative w-full max-w-[1240px] mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:block relative">
        <div 
          className={`w-full aspect-[1240/500] ${card.cardBackgroundColor}  mb-8 overflow-hidden`}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-[60%] h-[70%] absolute top-[15%] left-[5%]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, ${card.gridOpacity}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,${card.gridOpacity}) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex h-full items-center">
            {index % 2 === 0 ? (
              <>
                {/* Left Side - Question and Answer */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="font-new-black text-2xl lg:text-3xl xl:text-4xl text-white font-bold mb-6 leading-tight">
                    {card.question}
                  </h3>
                  <p className="font-alexandria text-sm lg:text-base xl:text-lg text-white/80 leading-relaxed">
                    {card.answer}
                  </p>
                </div>

                {/* Right Side - Image (400x400) */}
                <div className="flex justify-center items-center pr-8 lg:pr-12">
                  <div className="w-[400px] h-[400px] relative rounded-lg overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={card.question}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left Side - Image (400x400) */}
                <div className="flex justify-center items-center pl-8 lg:pl-12">
                  <div className="w-[400px] h-[400px] relative rounded-lg overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={card.question}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                </div>

                {/* Right Side - Question and Answer */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="font-new-black text-2xl lg:text-3xl xl:text-4xl text-white font-bold mb-6 leading-tight">
                    {card.question}
                  </h3>
                  <p className="font-alexandria text-sm lg:text-base xl:text-lg text-white/80 leading-relaxed">
                    {card.answer}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Character Sidebar */}
        <CharacterSidebar 
          characters={card.characters}
          sidebarBackgroundColor={card.sidebarBackgroundColor}
          sidebarCharacterColor={card.sidebarCharacterColor}
          index={index}
          isLeft={index % 2 !== 0} // isLeft should be true for odd cards (image on left)
        />
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden relative">
        <div 
          className={`w-full ${card.cardBackgroundColor} rounded-lg overflow-hidden p-6`}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-[80%] h-[60%] absolute top-[20%] left-[10%]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,${card.gridOpacity * 0.5}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,${card.gridOpacity * 0.5}) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          <div className="relative z-10">
            {/* Image */}
            <div className="w-full aspect-[4/3] relative mb-6 rounded-lg overflow-hidden">
              <Image
                src={card.imageUrl}
                alt={card.question}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>

            {/* Question */}
            <h3 className="font-new-black text-xl sm:text-2xl text-white font-bold mb-4 leading-tight">
              {card.question}
            </h3>

            {/* Answer */}
            <p className="font-alexandria text-sm sm:text-base text-white/80 leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
        {/* Character Sidebar for Mobile */}
        <CharacterSidebar 
          characters={card.characters}
          sidebarBackgroundColor={card.sidebarBackgroundColor}
          sidebarCharacterColor={card.sidebarCharacterColor}
          index={index}
          isLeft={index % 2 === 0}
          isMobile={true}
        />
      </div>
    </div>
  );
};

export default QuestionCard;

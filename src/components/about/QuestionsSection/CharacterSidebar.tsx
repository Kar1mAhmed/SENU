'use client';
import React from 'react';

interface CharacterSidebarProps {
  characters: string[];
  sidebarBackgroundColor: string;
  sidebarCharacterColor: string;
  index: number;
  isLeft: boolean;
  isMobile?: boolean;
}

const CharacterSidebar: React.FC<CharacterSidebarProps> = ({
  characters,
  sidebarBackgroundColor,
  sidebarCharacterColor,
  index,
  isLeft,
  isMobile = false
}) => {
  console.log(`🎭 Character sidebar rendering with "${characters.join(', ')}" - adding some personality!`);

  const colors = {
    bg: sidebarBackgroundColor,
    characterColor: sidebarCharacterColor
  };

  if (isMobile) {
    return (
      <div className={`absolute sm:hidden ${index % 2 === 0 ? 'left-[-10px] top-16' : 'right-[-10px] bottom-16'
        } w-[7.5%] aspect-[1/5] bg-opacity-90 ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%]`}>
        {characters.map((char, i) => (
          <div key={i} className={`w-[50%] h-[50%] max-w-[16px] max-h-[16px] flex items-center justify-center`}>
            <span className="font-new-black text-white text-xs font-bold">
              {char}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute hidden sm:flex ${isLeft
      ? 'left-0 -translate-x-1/2' // Left column: left side
      : 'right-0 translate-x-1/2' // Right column: right side
      } ${isLeft
        ? 'top-[10%]' // Left column: top 10% of image height
        : 'bottom-[10%]' // Right column: bottom (with 10% offset from bottom)
      } w-[7%] aspect-[1/5] min-w-[30px] max-w-[40px] min-h-[90px] max-h-[180px] ${colors.bg} rounded-full flex-col items-center justify-center gap-[8%] bg-opacity-90`}>
      {characters.map((char, i) => (
        <div key={i} className={`w-[60%] h-[60%] min-w-[12px] min-h-[12px] max-w-[26px] max-h-[26px] flex items-center justify-center`}>
          <span className="font-new-black text-white text-sm font-bold">
            {char}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CharacterSidebar;

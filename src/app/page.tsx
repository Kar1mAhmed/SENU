'use client';

import { useEffect, useState } from 'react';

const brandColors = {
  red: '#C13C1B',
  peach: '#F1C5A4',
  mint: '#CCEDDA',
  green: '#4FAF78',
  blue: '#DCF0F4',
  navy: '#0055D1',
  purple: '#E6CCE2'
};

const colorCombinations = [
  { bg: brandColors.navy, logo: brandColors.peach },
  // { bg: brandColors.red, logo: brandColors.mint },
  // { bg: brandColors.purple, logo: brandColors.navy },
  // { bg: brandColors.peach, logo: brandColors.navy },
];

export default function Home() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorCombinations.length);
    }, 5000); // Change every 1 second

    return () => clearInterval(interval);
  }, []);

  const currentColors = colorCombinations[currentColorIndex];

  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const logoColor = hexToRgb(currentColors.logo);
  const logoFilter = logoColor ?
    `brightness(0) saturate(100%) invert(${logoColor.r / 255}) sepia(${logoColor.g / 255}) saturate(${logoColor.b / 255}) hue-rotate(0deg) brightness(1) contrast(1)`
    : '';

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: currentColors.bg }}
    >
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Background orbs */}
      {/* <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#5d31ff]/5 rounded-full blur-[100px]"></div>
      <div className="absolute w-[250px] h-[250px] md:w-[550px] md:h-[550px] bg-[#1e1e1e]/20 rounded-full blur-[80px]"></div>
      <div className="absolute w-[280px] h-[280px] md:w-[580px] md:h-[580px] bg-[#5d31ff]/8 rounded-full blur-[90px]"></div> */}

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-[-75px] md:mb-[-150px] mt-0 md:mt-[-150px]">
          <img
            src="/logo.svg"
            alt="SENU"
            className="h-80 md:h-[620px] w-auto mx-auto"
            style={{
              filter: logoFilter
            }}
          />
        </div>

        {/* Coming Soon text */}
        <p className="text-lg md:text-xl font-light tracking-widest text-white font-alexandria">
          COMING SOON
        </p>
      </div>
    </div>
  );
}

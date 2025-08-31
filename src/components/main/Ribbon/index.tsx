import React from 'react';
import Icon from '../Icon';

const iconUrls = [
  '/Icons/bird.svg',
  '/Icons/crown.svg',
  '/Icons/columns.svg',
  '/Icons/eye.svg',
];

const Ribbon = () => {
  const repeatedIcons = Array(10).fill(iconUrls).flat().sort(() => Math.random() - 0.5);
  const repeatedIcons2 = Array(10).fill(iconUrls).flat().sort(() => Math.random() - 0.5);

  return (
    <div className="relative w-full h-40 overflow-hidden pointer-events-none">
      {/* Blue Ribbon */}
      <div
        className="absolute top-1/2 w-full h-[45px] bg-blue transform -rotate-[2.2deg] flex items-center justify-center"
      >
        <div className="flex items-center gap-x-[50px] md:gap-x-[100px]">
          {repeatedIcons.map((src, i) => (
            <Icon key={i} src={src} colorClass="bg-blue-soft" />
          ))}
        </div>
      </div>

      {/* Green Ribbon */}
      <div
        className="absolute top-1/2 w-full h-[45px] bg-green transform rotate-[2.2deg] flex items-center justify-center"
      >
        <div className="flex items-center gap-x-[50px] md:gap-x-[100px]">
          {repeatedIcons2.map((src, i) => (
            <Icon key={i} src={src} colorClass="bg-green-soft" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ribbon;

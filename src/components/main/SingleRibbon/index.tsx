import React from 'react';

// Single ribbon component that displays icons horizontally
// Props:
//  bgClass: Tailwind class for ribbon background
//  iconColorClass: Tailwind class applied to icon masks
//  heightPx: ribbon height in px (default 35)
//  rotation: rotation angle in degrees (default 0)
interface SingleRibbonProps {
  bgClass?: string;
  iconColorClass?: string;
  heightClass?: string;
  rotation?: number;
}

const iconUrls = [
  '/Icons/bird.svg',
  '/Icons/crown.svg',
  '/Icons/columns.svg',
  '/Icons/eye.svg',
];

const IconMask = ({ src, colorClass }: { src: string; colorClass: string }) => (
  <div
    className={`w-5 h-5 md:w-6 md:h-6 ${colorClass}`}
    style={{
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }}
  />
);

const SingleRibbon: React.FC<SingleRibbonProps> = ({
  bgClass = 'bg-glass-fill backdrop-blur-md',
  iconColorClass = 'bg-white/20',
  heightClass = 'h-[35px]',
  rotation = 0,
}) => {
  const repeatedIcons = Array(12).fill(iconUrls).flat();

  return (
    <div
      className={`w-full ${bgClass} ${heightClass} flex items-center justify-center overflow-hidden`}
      style={{ 
        transform: `rotate(${rotation}deg)`
      }}
    >
      <div className="flex items-center gap-x-8 md:gap-x-16">
        {repeatedIcons.map((src, i) => (
          <IconMask key={i} src={src} colorClass={iconColorClass} />
        ))}
      </div>
    </div>
  );
};

export default SingleRibbon;

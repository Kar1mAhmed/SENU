import React from 'react';

// Straight glassy ribbon that repeats brand icons horizontally.
// Props:
//  bgClass: Tailwind class for ribbon background (e.g. 'bg-glass-fill')
//  iconColorClass: Tailwind class applied to icon masks (e.g. 'bg-white/20')
//  height: optional ribbon height in px (default 45)
//  repeat: optional number of repeats of icon sequence (default 10)
interface StraightRibbonProps {
  bgClass?: string;
  iconColorClass?: string;
  heightPx?: number;
  repeat?: number;
}

const iconUrls = [
  '/Icons/bird.svg',
  '/Icons/columns.svg',
  '/Icons/crown.svg',
  '/Icons/eye.svg',
];

const IconMask = ({ src, colorClass }: { src: string; colorClass: string }) => (
  <div
    className={`w-6 h-6 md:w-8 md:h-8 ${colorClass}`}
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

const StraightRibbon: React.FC<StraightRibbonProps> = ({
  bgClass = 'bg-glass-fill backdrop-blur-md',
  iconColorClass = 'bg-white/20',
  heightPx = 45,
  repeat = 10,
}) => {
  const repeatedIcons = Array(repeat).fill(iconUrls).flat();

  return (
    <div
      className={`w-full ${bgClass}`}
      style={{ height: `${heightPx}px` }}
    >
      <div className="w-full h-full flex items-center justify-center gap-x-12 md:gap-x-24 overflow-hidden">
        {repeatedIcons.map((src, i) => (
          <IconMask key={i} src={src} colorClass={iconColorClass} />
        ))}
      </div>
    </div>
  );
};

export default StraightRibbon;

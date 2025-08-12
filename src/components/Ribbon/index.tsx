import React from 'react';

const iconUrls = [
  '/Icons/bird.svg',
  '/Icons/crown.svg',
  '/Icons/columns.svg',
  '/Icons/eye.svg',
];

const Icon = ({ src, colorClass }: { src: string; colorClass: string }) => (
  <div
    className={`w-4 h-4 md:w-6 md:h-6 ${colorClass}`}
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

const Ribbon = () => {
  const repeatedIcons = Array(10).fill(iconUrls).flat();

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
          {repeatedIcons.map((src, i) => (
            <Icon key={i} src={src} colorClass="bg-green-soft" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ribbon;

import React from 'react';

interface IconProps {
  src: string;
  colorClass: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ src, colorClass, className = '' }) => (
  <div
    className={`w-4 h-4 md:w-6 md:h-6 ${colorClass} ${className}`}
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

export default Icon;

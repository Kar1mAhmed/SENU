import React from 'react';

interface IconProps {
  src: string;
  colorClass: string;
  className?: string;
  customColor?: string; // Hex color for custom coloring
}

const Icon: React.FC<IconProps> = ({ src, colorClass, className = '', customColor }) => (
  <div
    className={`w-4 h-4 md:w-6 md:h-6 ${customColor ? '' : colorClass} ${className}`}
    style={{
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      ...(customColor ? { backgroundColor: customColor } : {})
    }}
  />
);

export default Icon;

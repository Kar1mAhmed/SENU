"use client";
import React from 'react';
import type { WithClassName } from '@/lib/types';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const IconButton: React.FC<WithClassName<IconButtonProps>> = ({ className, size = 'md', ...props }) => {
  return (
    <button
      {...props}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-full 
        bg-white/90 hover:bg-white
        text-black/80 hover:text-black
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
    />
  );
};

export default IconButton;

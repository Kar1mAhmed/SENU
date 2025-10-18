"use client";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ShapeBlurProps {
  children: React.ReactNode;
  className?: string;
  blur?: string;
  size?: number;
  duration?: number;
}

/**
 * ShapeBlur Component
 * Creates an animated blur effect that follows the cursor
 * Based on React Bits shape blur pattern
 */
const ShapeBlur: React.FC<ShapeBlurProps> = ({
  children,
  className = '',
  blur = '100px',
  size = 100,
  duration = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Blur effect */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: size,
          height: size,
          filter: `blur(${blur})`,
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          opacity: isHovered ? 1 : 0,
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration,
          ease: 'easeOut'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ShapeBlur;

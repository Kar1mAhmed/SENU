"use client";
import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollStackProps {
  children: ReactNode;
  index: number;
  totalCards: number;
  className?: string;
}

/**
 * ScrollStack Component
 * Creates a stacking effect where cards stick and scale as you scroll
 * Based on React Bits scroll stack pattern
 */
const ScrollStack: React.FC<ScrollStackProps> = ({ 
  children, 
  index, 
  totalCards,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for this card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Calculate scale based on card position in stack
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (totalCards - index) * 0.05] // Each card scales down slightly
  );

  // Calculate top position for stacking effect
  const top = index * 20; // 20px offset for each card

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        top: `${top}px`,
        position: 'sticky',
        zIndex: totalCards - index,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollStack;

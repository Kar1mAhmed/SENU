"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface RotatingTextProps {
  words: string[];
  duration?: number;
  className?: string;
  colors?: string[];
}

/**
 * RotatingText Animation Component
 * Cycles through an array of words with smooth animations
 * Based on React Bits rotating text pattern
 */
const RotatingText: React.FC<RotatingTextProps> = ({ 
  words, 
  duration = 2500,
  className = '',
  colors = []
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  // Get current color if colors array is provided
  const currentColor = colors.length > 0 ? colors[index % colors.length] : undefined;

  return (
    <span className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="inline-block font-bold"
          style={{ color: currentColor }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;

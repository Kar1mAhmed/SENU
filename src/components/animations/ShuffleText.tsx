"use client";
import React, { useEffect, useState } from 'react';

interface ShuffleTextProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: 'hover' | 'mount';
}

/**
 * ShuffleText Animation Component
 * Shuffles characters with random letters before revealing the final text
 * Based on React Bits shuffle text pattern
 */
const ShuffleText: React.FC<ShuffleTextProps> = ({ 
  text, 
  className = '',
  speed = 50,
  trigger = 'hover'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

  const shuffle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            if (index < iteration) {
              return text[index];
            }
            
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (trigger === 'mount') {
      // Delay the animation slightly on mount for better effect
      const timeout = setTimeout(() => {
        shuffle();
      }, 300);
      
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleInteraction = () => {
    if (trigger === 'hover') {
      shuffle();
    }
  };

  return (
    <span 
      className={`inline-block ${className}`}
      onMouseEnter={handleInteraction}
      style={{ cursor: trigger === 'hover' ? 'pointer' : 'default' }}
    >
      {displayText}
    </span>
  );
};

export default ShuffleText;

"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/main/Icon';

interface IconWord {
  icon: string;
  word: string;
  alt: string;
  bgColor: string;
  iconColor: string;
}

interface RotatingIconTextProps {
  items: IconWord[];
  duration?: number;
}

/**
 * RotatingIconText Component
 * Rotates through icons and matching words together
 */
const RotatingIconText: React.FC<RotatingIconTextProps> = ({ 
  items, 
  duration = 2500
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, duration);

    return () => clearInterval(interval);
  }, [items.length, duration]);

  const currentItem = items[index];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.word}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center justify-center"
        >
          {/* Icon with colored background */}
          <div className={`w-14 h-14 md:w-16 md:h-16 ${currentItem.bgColor} rounded-full mb-4 flex items-center justify-center`}>
            <Icon
              src={currentItem.icon}
              colorClass={currentItem.iconColor}
              className="w-[60%] h-[60%] min-w-[10px] min-h-[10px] max-w-[24px] max-h-[24px]"
            />
          </div>
          
          {/* Word */}
          <p className="font-alexandria text-xs text-gray-400 uppercase tracking-wider text-center">
            {currentItem.word}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingIconText;

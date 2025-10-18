"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
  delay?: number;
}

/**
 * CountUp Animation Component
 * Animates numbers from 0 to target value when element comes into view
 * Based on React Bits count-up animation pattern
 */
const CountUp: React.FC<CountUpProps> = ({ 
  value, 
  duration = 2, 
  suffix = '', 
  className = '',
  delay = 0
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Spring animation for smooth counting
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, spring, delay, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};

export default CountUp;

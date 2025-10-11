'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
}: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
            }
          : {
              opacity: 0,
              scale: 0.8,
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

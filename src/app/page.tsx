'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Services offered by the creative studio
const services = [
  "COMING SOON",
  "Shorts",
  "Branding",
  "Long Form",
  "Ads",
  "Motion Graphics",
  "Social Media"
];

export default function Home() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    // Set different durations based on the current text
    const duration = currentServiceIndex === 0 ? 3000 : 1000;

    const timer = setTimeout(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentServiceIndex]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden px-2">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative z-10 text-center max-w-6xl w-full">
        {/* Logo */}
        <div className="mb-6 md:mb-12">
          <img
            src="/logowhite.png"
            alt="SENU"
            className="h-[120px] md:h-[100px] lg:h-[200px] w-auto mx-auto"
          />
        </div>

        {/* Animated service text */}
        <div className="h-12 md:h-16 lg:h-20 relative">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={currentServiceIndex}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text- sm:text-xl md:text-2xl lg:text-3xl text-white font-alexandria absolute w-full whitespace-nowrap"
            >
              {services[currentServiceIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

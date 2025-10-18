"use client";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

/**
 * CircularGallery Component
 * Displays images in a circular arrangement with rotation animation
 * Based on React Bits circular gallery pattern
 */
const CircularGallery: React.FC<CircularGalleryProps> = ({ 
  images,
  autoRotate = true,
  rotationDuration = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-rotate through images
  useEffect(() => {
    if (!autoRotate || images.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, rotationDuration);

    return () => clearInterval(interval);
  }, [autoRotate, rotationDuration, images.length]);

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  // Calculate positions for horizontal circular arrangement
  const getCircularPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI; // Full circle
    const radiusX = 250; // Horizontal radius (wider)
    const radiusY = 80; // Vertical radius (flatter for horizontal effect)
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    return { x, y };
  };

  // Get visible images (current and surrounding)
  const getVisibleImages = () => {
    const visibleCount = Math.min(8, images.length); // Show up to 8 images
    const visible = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push({
        ...images[index],
        position: getCircularPosition(i, visibleCount),
        scale: i === 0 ? 1.2 : 1 - (i * 0.1), // Center image is larger
        opacity: i === 0 ? 1 : 0.6 - (i * 0.1),
        zIndex: visibleCount - i
      });
    }
    
    return visible;
  };

  const visibleImages = getVisibleImages();

  return (
    <div className={`relative ${className}`}>
      {/* Circular container */}
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {visibleImages.map((image, idx) => (
            <motion.div
              key={`${image.id}-${currentIndex}-${idx}`}
              initial={{ 
                x: image.position.x, 
                y: image.position.y,
                scale: image.scale,
                opacity: 0
              }}
              animate={{ 
                x: image.position.x, 
                y: image.position.y,
                scale: image.scale,
                opacity: image.opacity
              }}
              exit={{ 
                x: image.position.x - 50 * direction, 
                y: image.position.y,
                scale: 0.8,
                opacity: 0
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{ zIndex: image.zIndex }}
            >
              <div 
                className="relative rounded-lg overflow-hidden border-2 border-white/20 shadow-xl"
                style={{
                  width: idx === 0 ? '180px' : '120px',
                  height: idx === 0 ? '180px' : '120px'
                }}
              >
                <Image
                  src={image.thumbnailUrl}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 120px, 180px"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Center glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl" />
        </div>
      </div>

      {/* Navigation dots (optional) */}
      <div className="flex justify-center gap-2 mt-8">
        {images.slice(0, Math.min(images.length, 5)).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex % Math.min(images.length, 5)
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CircularGallery;

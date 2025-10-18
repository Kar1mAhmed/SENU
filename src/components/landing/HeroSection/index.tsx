'use client';
import React from 'react';
import RotatingText from '@/components/animations/RotatingText';
import WebGLGallery from '@/components/animations/WebGLGallery';
import { useThumbnails } from '@/lib/hooks/useThumbnails';

const HeroSection = () => {
  const { thumbnails, loading } = useThumbnails(12);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  // Transform thumbnails to gallery format with direct links
  const galleryItems = thumbnails.map(thumb => {
    // Convert project name to URL-friendly format (spaces to hyphens)
    const urlFriendlyName = thumb.name.replace(/\s+/g, '-');
    return {
      image: thumb.thumbnailUrl,
      text: thumb.name,
      link: `/portfolio/${urlFriendlyName}`
    };
  });

  // Preload images with timeout fallback
  React.useEffect(() => {
    if (thumbnails.length === 0) return;
    
    let loadedCount = 0;
    const totalImages = thumbnails.length;
    
    // Set a timeout to show gallery even if some images fail
    const timeout = setTimeout(() => {
      console.log('⏱️ Image loading timeout - showing gallery anyway');
      setImagesLoaded(true);
    }, 5000); // 5 second timeout
    
    const checkComplete = () => {
      loadedCount++;
      console.log(`📸 Loaded ${loadedCount}/${totalImages} images`);
      if (loadedCount === totalImages) {
        clearTimeout(timeout);
        setImagesLoaded(true);
      }
    };
    
    thumbnails.forEach((thumb, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for CDN images
      img.onload = () => {
        console.log(`✅ Image ${index + 1} loaded:`, thumb.name);
        checkComplete();
      };
      img.onerror = (error) => {
        console.error(`❌ Image ${index + 1} failed:`, thumb.name, error);
        checkComplete();
      };
      img.src = thumb.thumbnailUrl;
    });
    
    return () => clearTimeout(timeout);
  }, [thumbnails]);

  return (
    <section className="md:h-screen w-full flex flex-col md:justify-center px-4 lg:px-8 mt-32 py-8 md:py-0">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Hero Text with Rotating Animation */}
        <div className="text-center mb-0 ">
          <h1 className="font-new-black text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
            YOUR PROJECTS ARE
          </h1>
          <h1 className="font-new-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-tight">
            <RotatingText 
              words={['SELLING MORE', 'GROWING FASTER', 'STANDING OUT', 'WINNING HEARTS']} 
              colors={['#4FAF78', '#FAC53A', '#0055D1', '#EF4444']}
              duration={2500}
            /> WITH US
          </h1>
        </div>

        {/* WebGL Gallery - Project Thumbnails */}
        <div className="w-full h-[300px] md:h-[400px] xl:h-[500px]">
          {loading || !imagesLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white/50 text-sm ml-4">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Mobile Gallery - No curve, smaller cards */}
              <div className="block md:hidden h-full">
                <WebGLGallery 
                  items={galleryItems}
                  bend={0}
                  textColor="#ffffff"
                  borderRadius={0.08}
                  font="600 16px 'New Black Typeface', sans-serif"
                  scrollSpeed={3}
                  scrollEase={0.15}
                />
              </div>
              {/* Desktop Gallery - With curve */}
              <div className="hidden md:block h-full">
                <WebGLGallery 
                  items={galleryItems}
                  bend={3}
                  textColor="#ffffff"
                  borderRadius={0.05}
                  font="600 24px 'New Black Typeface', sans-serif"
                  scrollSpeed={2}
                  scrollEase={0.05}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

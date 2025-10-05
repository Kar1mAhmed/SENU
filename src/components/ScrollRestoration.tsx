'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom scroll restoration component for Next.js
 * Saves scroll position before navigation and restores it when returning
 */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable Next.js automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Skip scroll restoration for portfolio page (it handles its own restoration)
    if (pathname === '/portfolio') {
      console.log('⏭️ Skipping global scroll restoration for portfolio page');
      return;
    }

    // Get saved scroll position for current path
    const savedPosition = sessionStorage.getItem(`scroll-${pathname}`);
    
    console.log('📍 Scroll Restoration - Path:', pathname, 'Saved position:', savedPosition);
    
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      console.log('🔄 Restoring scroll to:', position);
      
      // Use multiple methods to ensure scroll restoration works
      // 1. Immediate attempt
      window.scrollTo(0, position);
      
      // 2. After animation frame
      requestAnimationFrame(() => {
        window.scrollTo(0, position);
      });
      
      // 3. After a short delay to ensure DOM is fully loaded
      const timer = setTimeout(() => {
        window.scrollTo(0, position);
        console.log('✅ Final scroll restoration to:', position, 'Current scroll:', window.scrollY);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // If no saved position, scroll to top
      console.log('⬆️ No saved position, scrolling to top');
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    // Save scroll position before leaving the page
    const saveScrollPosition = () => {
      const currentScroll = window.scrollY;
      console.log('💾 Saving scroll position:', currentScroll, 'for path:', pathname);
      sessionStorage.setItem(`scroll-${pathname}`, currentScroll.toString());
    };

    // Listen for navigation events
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Save scroll position when component unmounts (navigation within app)
    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [pathname]);

  return null;
}

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

        // Get saved scroll position for current path
        const savedPosition = sessionStorage.getItem(`scroll-${pathname}`);

        if (savedPosition) {
            const position = parseInt(savedPosition, 10);
            // Restore scroll position after a brief delay to ensure DOM is ready
            requestAnimationFrame(() => {
                window.scrollTo(0, position);
            });
        } else {
            // If no saved position, scroll to top
            window.scrollTo(0, 0);
        }

        // Save scroll position before leaving the page
        const saveScrollPosition = () => {
            sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
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

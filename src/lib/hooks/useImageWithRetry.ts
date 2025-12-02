import { useState, useEffect, useCallback } from 'react';

interface UseImageWithRetryOptions {
    /** Maximum number of retry attempts */
    maxRetries?: number;
    /** Initial retry delay in milliseconds */
    initialDelay?: number;
    /** Fallback image URL when all retries fail */
    fallbackImage?: string;
    /** Timeout for each image load attempt in milliseconds */
    timeout?: number;
}

interface UseImageWithRetryResult {
    /** Current image source (may be fallback if loading failed) */
    src: string;
    /** Whether the image is currently loading */
    loading: boolean;
    /** Error message if loading failed */
    error: string | null;
    /** Number of retry attempts made */
    retryCount: number;
    /** Whether fallback image is being used */
    isUsingFallback: boolean;
    /** Manually retry loading the image */
    retry: () => void;
}

/**
 * Custom hook for loading images with exponential backoff retry logic
 * Handles network failures gracefully with fallback support
 * 
 * @example
 * ```tsx
 * const { src, loading, error, isUsingFallback } = useImageWithRetry(
 *   'https://example.com/image.jpg',
 *   { maxRetries: 3, fallbackImage: '/placeholder.png' }
 * );
 * 
 * return <img src={src} alt="..." />;
 * ```
 */
export function useImageWithRetry(
    imageSrc: string,
    options: UseImageWithRetryOptions = {}
): UseImageWithRetryResult {
    const {
        maxRetries = 3,
        initialDelay = 500,
        fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E',
        timeout = 10000,
    } = options;

    const [src, setSrc] = useState<string>(imageSrc);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
    const [shouldRetry, setShouldRetry] = useState<number>(0);

    const loadImage = useCallback(
        (url: string, attempt: number): Promise<void> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                let timeoutId: NodeJS.Timeout;

                // Set timeout for this attempt
                timeoutId = setTimeout(() => {
                    img.src = ''; // Cancel loading
                    reject(new Error(`Image load timeout after ${timeout}ms`));
                }, timeout);

                img.onload = () => {
                    clearTimeout(timeoutId);
                    resolve();
                };

                img.onerror = () => {
                    clearTimeout(timeoutId);
                    reject(new Error('Failed to load image'));
                };

                // Start loading
                img.crossOrigin = 'anonymous';
                img.decoding = 'async';
                img.src = url;
            });
        },
        [timeout]
    );

    const attemptLoad = useCallback(
        async (attempt: number) => {
            setLoading(true);
            setRetryCount(attempt);

            try {
                // Try loading the original image
                await loadImage(imageSrc, attempt);

                // Success!
                setSrc(imageSrc);
                setLoading(false);
                setError(null);
                setIsUsingFallback(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.warn(`Image load attempt ${attempt + 1}/${maxRetries + 1} failed:`, errorMessage, imageSrc);

                if (attempt < maxRetries) {
                    // Calculate exponential backoff delay
                    const delay = initialDelay * Math.pow(2, attempt);
                    console.log(`Retrying in ${delay}ms...`);

                    // Wait and retry
                    setTimeout(() => {
                        setShouldRetry(prev => prev + 1);
                    }, delay);
                } else {
                    // All retries exhausted, use fallback
                    console.error(`All ${maxRetries + 1} attempts failed for:`, imageSrc);
                    console.log('Using fallback image');

                    setSrc(fallbackImage);
                    setLoading(false);
                    setError(`Failed to load image after ${maxRetries + 1} attempts`);
                    setIsUsingFallback(true);
                }
            }
        },
        [imageSrc, loadImage, maxRetries, initialDelay, fallbackImage]
    );

    // Trigger load when image source changes or retry is requested
    useEffect(() => {
        attemptLoad(retryCount);
    }, [imageSrc, shouldRetry]);

    // Manual retry function
    const retry = useCallback(() => {
        setRetryCount(0);
        setError(null);
        setIsUsingFallback(false);
        setShouldRetry(prev => prev + 1);
    }, []);

    return {
        src,
        loading,
        error,
        retryCount,
        isUsingFallback,
        retry,
    };
}

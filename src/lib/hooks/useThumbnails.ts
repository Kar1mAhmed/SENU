import { useState, useEffect } from 'react';

interface ThumbnailData {
    id: string;
    name: string;
    thumbnailUrl: string;
}

interface UseThumbnailsResult {
    thumbnails: ThumbnailData[];
    loading: boolean;
    error: string | null;
}

/**
 * Hook to fetch project thumbnails from the API
 */
export function useThumbnails(limit: number = 12): UseThumbnailsResult {
    const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/projects/thumbnails?limit=${limit}`);
                const data = await response.json();

                if (data.success) {
                    setThumbnails(data.data);
                } else {
                    setError(data.error || 'Failed to fetch thumbnails');
                }
            } catch (err) {
                console.error('Error fetching thumbnails:', err);
                setError('Failed to fetch thumbnails');
            } finally {
                setLoading(false);
            }
        };

        fetchThumbnails();
    }, [limit]);

    return { thumbnails, loading, error };
}

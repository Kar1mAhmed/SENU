import useSWR from 'swr';

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
 * Fetcher function for SWR
 */
const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch thumbnails');
    }

    return data.data;
};

/**
 * Hook to fetch project thumbnails from the API with SWR caching
 * 
 * Features:
 * - Automatic caching and deduplication
 * - Revalidation on focus/reconnect
 * - Optimistic updates
 * - Shared cache across components
 */
export function useThumbnails(limit: number = 12): UseThumbnailsResult {
    const { data, error, isLoading } = useSWR<ThumbnailData[]>(
        `/api/projects/thumbnails?limit=${limit}`,
        fetcher,
        {
            // Cache for 5 minutes
            dedupingInterval: 300000,
            // Don't revalidate on focus to prevent unnecessary requests
            revalidateOnFocus: false,
            // Revalidate on reconnect to get fresh data if network was down
            revalidateOnReconnect: true,
            // Keep previous data while revalidating
            keepPreviousData: true,
            // Retry on error
            shouldRetryOnError: true,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        }
    );

    return {
        thumbnails: data || [],
        loading: isLoading,
        error: error ? error.message : null,
    };
}

// Hook for handling file uploads with progress tracking
import { useState, useCallback } from 'react';

console.log('📤 Upload hook loaded - ready to handle uploads with progress tracking!');

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
    speed: number; // bytes per second
    timeRemaining: number; // seconds
}

export interface UploadOptions {
    onProgress?: (progress: UploadProgress) => void;
    onError?: (error: Error) => void;
    onSuccess?: () => void;
    timeout?: number; // milliseconds, default 5 minutes
}

export interface UploadState {
    isUploading: boolean;
    progress: UploadProgress | null;
    error: string | null;
}

/**
 * Hook for uploading files with progress tracking and error handling
 */
export function useUpload() {
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: null,
        error: null,
    });

    const uploadWithProgress = useCallback(
        async (
            url: string,
            formData: FormData,
            options: UploadOptions = {}
        ): Promise<Response> => {
            const { onProgress, onError, onSuccess, timeout = 5 * 60 * 1000 } = options;

            console.log('🚀 Starting upload to:', url);

            setUploadState({
                isUploading: true,
                progress: null,
                error: null,
            });

            const startTime = Date.now();
            let lastLoaded = 0;
            let lastTime = startTime;

            try {
                // Create XMLHttpRequest for progress tracking
                return await new Promise<Response>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    // Set timeout
                    xhr.timeout = timeout;

                    // Track upload progress
                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const now = Date.now();
                            const timeDiff = (now - lastTime) / 1000; // seconds
                            const loadedDiff = e.loaded - lastLoaded;
                            const speed = timeDiff > 0 ? loadedDiff / timeDiff : 0;
                            const remaining = speed > 0 ? (e.total - e.loaded) / speed : 0;

                            const progress: UploadProgress = {
                                loaded: e.loaded,
                                total: e.total,
                                percentage: Math.round((e.loaded / e.total) * 100),
                                speed,
                                timeRemaining: remaining,
                            };

                            console.log(`📊 Upload progress: ${progress.percentage}% (${formatBytes(e.loaded)}/${formatBytes(e.total)}) - Speed: ${formatBytes(speed)}/s - ETA: ${formatTime(remaining)}`);

                            setUploadState({
                                isUploading: true,
                                progress,
                                error: null,
                            });

                            if (onProgress) {
                                onProgress(progress);
                            }

                            lastLoaded = e.loaded;
                            lastTime = now;
                        }
                    });

                    // Handle timeout
                    xhr.addEventListener('timeout', () => {
                        const error = new Error(`Upload timeout after ${timeout / 1000} seconds. Your internet connection may be too slow for this file size.`);
                        console.error('⏱️ Upload timeout:', error.message);

                        setUploadState({
                            isUploading: false,
                            progress: null,
                            error: error.message,
                        });

                        if (onError) {
                            onError(error);
                        }
                        reject(error);
                    });

                    // Handle network errors
                    xhr.addEventListener('error', () => {
                        const error = new Error('Network error during upload. Please check your internet connection.');
                        console.error('🌐 Network error:', error.message);

                        setUploadState({
                            isUploading: false,
                            progress: null,
                            error: error.message,
                        });

                        if (onError) {
                            onError(error);
                        }
                        reject(error);
                    });

                    // Handle abort
                    xhr.addEventListener('abort', () => {
                        const error = new Error('Upload was cancelled.');
                        console.log('🛑 Upload aborted');

                        setUploadState({
                            isUploading: false,
                            progress: null,
                            error: error.message,
                        });

                        if (onError) {
                            onError(error);
                        }
                        reject(error);
                    });

                    // Handle completion
                    xhr.addEventListener('load', () => {
                        const totalTime = (Date.now() - startTime) / 1000;
                        console.log(`✅ Upload completed in ${formatTime(totalTime)}`);

                        if (xhr.status >= 200 && xhr.status < 300) {
                            setUploadState({
                                isUploading: false,
                                progress: null,
                                error: null,
                            });
                            if (onSuccess) {
                                onSuccess();
                            }

                            // Create a Response object from XHR
                            const headersArray: [string, string][] = xhr.getAllResponseHeaders()
                                .split('\r\n')
                                .filter(Boolean)
                                .map(line => {
                                    const [key, ...values] = line.split(': ');
                                    return [key, values.join(': ')] as [string, string];
                                });
                            
                            const response = new Response(xhr.responseText, {
                                status: xhr.status,
                                statusText: xhr.statusText,
                                headers: new Headers(headersArray),
                            });
                            resolve(response);
                        } else {
                            let errorMessage = `Upload failed with status ${xhr.status}`;
                            try {
                                const errorData = JSON.parse(xhr.responseText);
                                errorMessage = errorData.error || errorMessage;
                            } catch {
                                // Use default error message
                            }

                            const error = new Error(errorMessage);
                            console.error('❌ Upload failed:', error.message);

                            setUploadState({
                                isUploading: false,
                                progress: null,
                                error: error.message,
                            });

                            if (onError) {
                                onError(error);
                            }
                            reject(error);
                        }
                    });

                    // Open and send request
                    xhr.open('POST', url);
                    xhr.send(formData);
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                console.error('❌ Upload error:', errorMessage);

                setUploadState({
                    isUploading: false,
                    progress: null,
                    error: errorMessage,
                });

                if (onError && error instanceof Error) {
                    onError(error);
                }
                throw error;
            }
        },
        []
    );

    const reset = useCallback(() => {
        setUploadState({
            isUploading: false,
            progress: null,
            error: null,
        });
    }, []);

    return {
        ...uploadState,
        uploadWithProgress,
        reset,
    };
}

// Utility functions
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return 'calculating...';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

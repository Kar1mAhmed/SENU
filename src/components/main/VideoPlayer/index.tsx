'use client';
import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  projectName?: string;
  projectWork?: string[];
  projectType?: 'horizontal' | 'vertical';
  className?: string;
  showProjectInfo?: boolean;
  onVideoClick?: (e: React.MouseEvent) => void;
  lazyLoad?: boolean;
  autoGeneratePoster?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  projectName,
  projectWork,
  projectType = 'horizontal',
  className = '',
  showProjectInfo = false,
  onVideoClick,
  lazyLoad = false,
  autoGeneratePoster = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazyLoad);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isFullscreen) {
      const resetTimeout = () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            setShowControls(false);
          }
        }, 3000);
      };

      const handleMouseMove = () => resetTimeout();
      const handleMouseLeave = () => {
        if (isPlaying) {
          setShowControls(false);
        }
      };

      const container = containerRef.current;
      resetTimeout();
      document.addEventListener('mousemove', handleMouseMove);
      container?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        container?.removeEventListener('mouseleave', handleMouseLeave);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [isFullscreen, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!lazyLoad || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current && containerRef.current) {
              observerRef.current.unobserve(containerRef.current);
            }
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazyLoad]);

  useEffect(() => {
    if (!autoGeneratePoster || posterUrl || !isInView || generatedPoster) return;

    const video = videoRef.current;
    if (!video) return;

    const generatePoster = () => {
      try {
        const seekTime = Math.min(3, video.duration * 0.1);
        
        const captureFrame = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx && video.videoWidth > 0) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const posterDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setGeneratedPoster(posterDataUrl);
              video.currentTime = 0;
            }
          } catch (error) {}
        };
        
        const handleSeeked = () => {
          captureFrame();
          video.removeEventListener('seeked', handleSeeked);
        };
        
        video.addEventListener('seeked', handleSeeked);
        video.currentTime = seekTime;
      } catch (error) {}
    };

    const handleCanGenerate = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        generatePoster();
      }
    };

    video.addEventListener('loadedmetadata', handleCanGenerate);
    video.addEventListener('canplay', handleCanGenerate);

    return () => {
      video.removeEventListener('loadedmetadata', handleCanGenerate);
      video.removeEventListener('canplay', handleCanGenerate);
    };
  }, [autoGeneratePoster, posterUrl, isInView, generatedPoster]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isDragging) return;
    
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    
    if (duration === 0 && !isNaN(total) && isFinite(total) && total > 0) {
      setDuration(total);
    }
    
    setCurrentTime(current);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        setDuration(videoDuration);
      }
      setIsVideoLoaded(true);
    }
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleProgressBarInteraction = (clientX: number) => {
    if (!progressRef.current || !videoRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));
    const targetTime = percentage * duration;
    
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(percentage * 100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden bg-black ${
        isFullscreen
          ? projectType === 'vertical'
            ? 'fixed inset-0 z-50 rounded-none flex items-center justify-center bg-black'
            : 'fixed inset-0 z-50 rounded-none'
          : 'w-full h-full'
      } ${className}`}
      onMouseMove={() => {
        if (isFullscreen) setShowControls(true);
      }}
      onClick={onVideoClick}
    >
      {isInView ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || generatedPoster || undefined}
          className={`${
            isFullscreen && projectType === 'vertical'
              ? 'h-full w-auto max-w-none'
              : 'absolute inset-0 w-full h-full'
          } object-cover`}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={() => {
            if (videoRef.current) {
              const videoDuration = videoRef.current.duration;
              if (!isNaN(videoDuration) && isFinite(videoDuration) && videoDuration > 0) {
                setDuration(videoDuration);
              }
            }
          }}
          onLoadedData={() => {
            if (videoRef.current && duration === 0) {
              const videoDuration = videoRef.current.duration;
              if (!isNaN(videoDuration) && isFinite(videoDuration)) {
                setDuration(videoDuration);
              }
            }
          }}
          onCanPlay={() => setIsBuffering(false)}
          onWaiting={() => setIsBuffering(true)}
          onError={() => {
            setHasError(true);
            setIsBuffering(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading video...</div>
        </div>
      )}

      <div className="absolute inset-0 cursor-pointer" onClick={togglePlayPause} />

      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="text-white text-sm">Loading...</div>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/50">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="text-red-400 text-sm">Failed to load video</div>
          </div>
        </div>
      )}

      {!isPlaying && !isBuffering && !hasError && isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`${projectType === 'vertical' ? 'w-12 h-12' : 'w-16 h-16'} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300`}>
            <svg width={projectType === 'vertical' ? '20' : '24'} height={projectType === 'vertical' ? '20' : '24'} viewBox="0 0 24 24" fill="none">
              <polygon points="8,5 19,12 8,19" fill="white" />
            </svg>
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 pointer-events-none ${
          showControls || !isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-md border-t border-white/10 px-3 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button onClick={togglePlayPause} className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0">
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 19,12 8,19" fill="currentColor" />
                </svg>
              )}
            </button>

            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0">
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M23 9L17 15M17 9L23 15" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M19.07 4.93A10 10 0 0122 12A10 10 0 0119.07 19.07M15.54 8.46A5 5 0 0117 12A5 5 0 0115.54 15.54" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>

            <div className="text-white text-xs flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>

            <div
              ref={progressRef}
              className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative group mx-2"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                
                setIsDragging(true);
                handleProgressBarInteraction(e.clientX);

                const onMouseMove = (moveEvent: MouseEvent) => {
                  handleProgressBarInteraction(moveEvent.clientX);
                };

                const onMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDragging) {
                  handleProgressBarInteraction(e.clientX);
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full pointer-events-none"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>

            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0">
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3V5H5V8H3V3H8ZM21 3V8H19V5H16V3H21ZM21 16V21H16V19H19V16H21ZM8 21H3V16H5V19H8V21Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 14H5V19H10V17H7V14ZM12 14H14V17H17V19H12V14ZM17 10V7H14V5H19V10H17ZM10 5V7H7V10H5V5H10Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isFullscreen && showProjectInfo && projectName && (
        <div
          className={`absolute top-0 left-0 right-0 transition-all duration-300 pointer-events-none ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          }`}
        >
          <div className="bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-md p-6 pointer-events-auto">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-white text-xl lg:text-2xl font-light mb-2">{projectName}</h5>
                {projectWork && projectWork.length > 0 && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                    <p className="text-gray-400 font-semibold">Work:</p>
                    {projectWork.map((tag, idx) => (
                      <span key={idx} className="text-gray-300">
                        {tag}{idx < projectWork.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleFullscreen} className="text-white hover:text-red-400 transition-colors p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
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
}

console.log('🎬 VideoPlayer component loaded - reusable video player with all the bells and whistles!');

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  projectName,
  projectWork,
  projectType = 'horizontal',
  className = '',
  showProjectInfo = false,
  onVideoClick
}) => {
  console.log('🎥 VideoPlayer rendering with videoUrl:', videoUrl, 'posterUrl:', posterUrl);
  // Video control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls in fullscreen
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

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      
      // Update duration if it wasn't set yet
      if (duration === 0 && !isNaN(total) && isFinite(total) && total > 0) {
        setDuration(total);
        console.log('📹 Video duration updated from timeupdate:', total);
      }
      
      setCurrentTime(current);
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      console.log('📹 Video metadata loaded - Duration:', videoDuration, 'ReadyState:', videoRef.current.readyState, 'NetworkState:', videoRef.current.networkState);
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        setDuration(videoDuration);
        console.log('✅ Video duration set:', videoDuration, 'seconds');
      } else {
        console.warn('⚠️ Invalid duration received:', videoDuration);
      }
    }
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    console.log('▶️ Play/Pause toggled - current state:', isPlaying ? 'playing' : 'paused');
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
      console.log('🔊 Mute toggled:', videoRef.current.muted ? 'muted' : 'unmuted');
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      console.log('🖥️ Entered fullscreen mode');
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      console.log('🖥️ Exited fullscreen mode');
    }
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      const newTime = (newProgress / 100) * duration;

      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };

  const handleProgressDrag = (e: MouseEvent) => {
    if (isDragging && videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const dragX = e.clientX - rect.left;
      const newProgress = Math.max(0, Math.min(100, (dragX / rect.width) * 100));
      const newTime = (newProgress / 100) * duration;

      setProgress(newProgress);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden bg-black ${isFullscreen
        ? projectType === 'vertical'
          ? 'fixed inset-0 z-50 rounded-none flex items-center justify-center bg-black'
          : 'fixed inset-0 z-50 rounded-none'
        : 'w-full h-full'
        } ${className}`}
      onMouseMove={() => {
        if (isFullscreen) {
          setShowControls(true);
        }
      }}
      onClick={onVideoClick}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className={`${isFullscreen && projectType === 'vertical'
          ? 'h-full w-auto max-w-none'
          : 'absolute inset-0 w-full h-full'
          } object-cover`}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={() => {
          if (videoRef.current) {
            const videoDuration = videoRef.current.duration;
            if (!isNaN(videoDuration) && isFinite(videoDuration) && videoDuration > 0) {
              setDuration(videoDuration);
              console.log('📹 Video duration from durationchange:', videoDuration);
            }
          }
        }}
        onLoadedData={() => {
          if (videoRef.current && duration === 0) {
            const videoDuration = videoRef.current.duration;
            if (!isNaN(videoDuration) && isFinite(videoDuration)) {
              setDuration(videoDuration);
              console.log('📹 Video duration from loadeddata:', videoDuration);
            }
          }
        }}
        onCanPlay={() => {
          if (videoRef.current && duration === 0) {
            const videoDuration = videoRef.current.duration;
            if (!isNaN(videoDuration) && isFinite(videoDuration) && videoDuration > 0) {
              setDuration(videoDuration);
              console.log('📹 Video duration from canplay:', videoDuration);
            }
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Click overlay for play/pause */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlayPause}
      />

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`${projectType === 'vertical' ? 'w-12 h-12' : 'w-16 h-16'} bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300`}>
            <svg width={projectType === 'vertical' ? '20' : '24'} height={projectType === 'vertical' ? '20' : '24'} viewBox="0 0 24 24" fill="none">
              <polygon points="8,5 19,12 8,19" fill="white" />
            </svg>
          </div>
        </div>
      )}

      {/* Video Controls - Single Row */}
      <div
        className={`video-controls absolute bottom-0 left-0 right-0 transition-all duration-300 pointer-events-none ${showControls || !isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}
      >
        {/* Single Row Control Bar with Progress Bar Integrated */}
        <div className="bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-md border-t border-white/10 px-3 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0"
            >
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

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0"
            >
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

            {/* Time Display */}
            <div className="text-white text-xs font-new-black flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>

            {/* Progress Bar - Takes up remaining space */}
            <div
              ref={progressRef}
              className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative group mx-2"
              onClick={handleProgressClick}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleProgressClick(e);

                const handleMouseMove = (e: MouseEvent) => handleProgressDrag(e);
                const handleMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              {/* Progress Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors p-1 flex-shrink-0"
            >
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

      {/* Project Info Overlay (in fullscreen) */}
      {isFullscreen && showProjectInfo && projectName && (
        <div
          className={`absolute top-0 left-0 right-0 transition-all duration-300 pointer-events-none ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
        >
          <div className="bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-md p-6 pointer-events-auto">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-white text-xl lg:text-2xl font-light mb-2 font-new-black-light">{projectName}</h5>
                {projectWork && projectWork.length > 0 && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                    <p className="text-gray-400 font-semibold">Work:</p>
                    {projectWork.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-gray-300">
                        {tag}{tagIndex < projectWork.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-red-400 transition-colors p-2 flex-shrink-0"
              >
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

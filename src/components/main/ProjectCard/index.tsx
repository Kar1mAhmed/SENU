// src/components/main/ProjectCard/index.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Icon from '../Icon';
import { Project } from '@/lib/types';

interface ProjectCardProps {
    project: Project;
    index: number;
    isLeft?: boolean;
    layout?: 'zigzag' | 'fullwidth';
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    index,
    isLeft = false,
    layout = 'zigzag'
}) => {
    console.log('🎨 Rendering ProjectCard:', project.name, 'type:', project.type, 'category:', project.category);

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

    const icons = ['/Icons/bird.svg', '/Icons/eye.svg', '/Icons/crown.svg'];

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

            resetTimeout();
            document.addEventListener('mousemove', handleMouseMove);
            containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
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
            setCurrentTime(current);
            setProgress((current / total) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const togglePlayPause = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        console.log('🎬 Video control clicked - current state:', isPlaying ? 'playing' : 'paused');
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
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
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
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Color variations cycle through different themes
    const colorVariations = [
        { bg: 'bg-green', iconColor: 'bg-green-40' },
        { bg: 'bg-red-50', iconColor: 'bg-red-20' },
        { bg: 'bg-blue', iconColor: 'bg-blue-40' },
        { bg: 'bg-orange-50', iconColor: 'bg-orange-30' },
    ];
    const colors = colorVariations[index % 4];

    // Enhanced Video Player Component
    const renderEnhancedVideoPlayer = () => (
        <div 
            ref={containerRef}
            className={`absolute inset-0 rounded-lg overflow-hidden bg-black group ${
                isFullscreen 
                    ? project.type === 'vertical' 
                        ? 'fixed inset-0 z-50 rounded-none flex items-center justify-center bg-black' 
                        : 'fixed inset-0 z-50 rounded-none'
                    : ''
            }`}
            onMouseMove={() => {
                if (isFullscreen) {
                    setShowControls(true);
                }
            }}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.imageUrl}
                className={`${
                    isFullscreen && project.type === 'vertical' 
                        ? 'h-full w-auto max-w-none' 
                        : 'w-full h-full'
                } object-cover transition-transform duration-700 ease-out group-hover:scale-110`}
                muted={isMuted}
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
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
                    <div className={`${project.type === 'vertical' ? 'w-12 h-12' : 'w-16 h-16'} bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300`}>
                        <svg width={project.type === 'vertical' ? '20' : '24'} height={project.type === 'vertical' ? '20' : '24'} viewBox="0 0 24 24" fill="none">
                            <polygon points="8,5 19,12 8,19" fill="white" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Video Controls - Single Row */}
            <div 
                className={`absolute bottom-0 left-0 right-0 transition-all duration-300 pointer-events-none ${
                    showControls || !isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
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
                                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M23 9L17 15M17 9L23 15" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M19.07 4.93A10 10 0 0122 12A10 10 0 0119.07 19.07M15.54 8.46A5 5 0 0117 12A5 5 0 0115.54 15.54" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            )}
                        </button>

                        {/* Time Display */}
                        <div className="text-white text-xs font-mono flex-shrink-0">
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
                                    <path d="M8 3V5H5V8H3V3H8ZM21 3V8H19V5H16V3H21ZM21 16V21H16V19H19V16H21ZM8 21H3V16H5V19H8V21Z" fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 14H5V19H10V17H7V14ZM12 14H14V17H17V19H12V14ZM17 10V7H14V5H19V10H17ZM10 5V7H7V10H5V5H10Z" fill="currentColor"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Info Overlay (in fullscreen) */}
            {isFullscreen && (
                <div 
                    className={`absolute top-0 left-0 right-0 transition-all duration-300 pointer-events-none ${
                        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                    }`}
                >
                    <div className="bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-md p-6 pointer-events-auto">
                        <div className="flex items-start justify-between">
                            <div>
                                <h5 className="text-white text-xl lg:text-2xl font-light mb-2 font-new-black-light">{project.name}</h5>
                                {/* <p className="text-gray-300">
                                    <span className="font-semibold text-gray-400">Client:</span> {project.client}
                                </p> */}
                                <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                                    <p className="text-gray-400 font-semibold">Work:</p>
                                    {project.work.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="text-gray-300">
                                            {tag}{tagIndex < project.work.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                                {/* {project.description && (
                                    <p className="text-gray-400 mt-2 leading-relaxed max-w-2xl">
                                        {project.description}
                                    </p>
                                )} */}
                            </div>
                            
                            {/* Close Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-red-400 transition-colors p-2 flex-shrink-0"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Render image project (standard card)
    const renderImageProject = () => (
        <div className="w-full bg-transparent flex flex-col mb-8 group">
            <div className="relative w-full px-6">
                <div className="relative w-full aspect-[560/620] max-w-full md:max-w-[450px] lg:max-w-[480px] xl:max-w-[560px] mx-auto">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <Image
                            src={project.imageUrl}
                            alt={project.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 450px, (max-width: 1280px) 480px, 560px"
                        />
                    </div>

                    {/* Icons Sidebar - Mobile */}
                    <div className={`absolute sm:hidden ${index % 2 === 0 ? 'left-[-10px] top-16' : 'right-[-10px] bottom-16'
                        } w-[10%] bg-opacity-90 ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%]
                    transition-all duration-500 ease-out aspect-[1/4] group-hover:aspect-[1/5]`}>
                        {icons.map((icon, iconIndex) => (
                            <Icon
                                key={iconIndex}
                                src={icon}
                                colorClass={colors.iconColor}
                                className="w-[50%] h-[50%] max-w-[16px] max-h-[16px] transition-all duration-300 ease-out group-hover:scale-110"
                            />
                        ))}
                    </div>

                    {/* Icons Sidebar - Desktop */}
                    <div className={`absolute hidden sm:flex ${isLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                        } ${isLeft ? 'top-[10%]' : 'bottom-[10%]'
                        } w-[7%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex-col items-center justify-center gap-[8%] bg-opacity-90
                    transition-all duration-500 ease-out aspect-[1/5] min-h-[90px] max-h-[180px]
                    group-hover:aspect-[1/6] group-hover:min-h-[120px] group-hover:max-h-[240px]`}>
                        {icons.map((icon, iconIndex) => (
                            <Icon
                                key={iconIndex}
                                src={icon}
                                colorClass={colors.iconColor}
                                className="w-[60%] h-[60%] min-w-[12px] min-h-[12px] max-w-[26px] max-h-[26px] transition-all duration-300 ease-out group-hover:scale-110"
                            />
                        ))}
                    </div>
                </div>
            </div>
            {renderProjectDetails()}
        </div>
    );

    // Render vertical video project (shorts - smaller height)
    const renderVerticalProject = () => (
        <div className="w-full bg-transparent flex flex-col mb-8 group">
            <div className="relative w-full px-6">
                <div className="relative w-full aspect-[9/16] max-w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px] mx-auto">
                    {project.videoUrl ? (
                        renderEnhancedVideoPlayer()
                    ) : (
                        <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                            <Image
                                src={project.imageUrl}
                                alt={project.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 280px, (max-width: 1280px) 300px, 320px"
                            />
                        </div>
                    )}

                    {/* Icons Sidebar - Mobile */}
                    <div className={`absolute sm:hidden ${index % 2 === 0 ? 'left-[-10px] top-16' : 'right-[-10px] bottom-16'
                        } w-[10%] bg-opacity-90 ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%]
                    transition-all duration-500 ease-out aspect-[1/4] group-hover:aspect-[1/5] z-10`}>
                        {icons.map((icon, iconIndex) => (
                            <Icon
                                key={iconIndex}
                                src={icon}
                                colorClass={colors.iconColor}
                                className="w-[50%] h-[50%] max-w-[16px] max-h-[16px] transition-all duration-300 ease-out group-hover:scale-110"
                            />
                        ))}
                    </div>

                    {/* Icons Sidebar - Desktop */}
                    <div className={`absolute hidden sm:flex ${isLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                        } ${isLeft ? 'top-[10%]' : 'bottom-[10%]'
                        } w-[7%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex-col items-center justify-center gap-[8%] bg-opacity-90
                    transition-all duration-500 ease-out aspect-[1/5] min-h-[90px] max-h-[180px]
                    group-hover:aspect-[1/6] group-hover:min-h-[120px] group-hover:max-h-[240px] z-10`}>
                        {icons.map((icon, iconIndex) => (
                            <Icon
                                key={iconIndex}
                                src={icon}
                                colorClass={colors.iconColor}
                                className="w-[60%] h-[60%] min-w-[12px] min-h-[12px] max-w-[26px] max-h-[26px] transition-all duration-300 ease-out group-hover:scale-110"
                            />
                        ))}
                    </div>
                </div>
            </div>
            {renderProjectDetails()}
        </div>
    );

    // Render horizontal video project (full width with alternating text position)
    const renderHorizontalProject = () => {
        const shouldTextBeOnLeft = index % 2 === 0;

        return (
            <div className="w-full bg-transparent flex flex-col mb-12 group">
                {/* Mobile: Stacked layout */}
                <div className="block lg:hidden">
                    <div className="relative w-full px-6">
                        <div className="relative w-full aspect-[16/9] mx-auto">
                            {project.videoUrl ? renderEnhancedVideoPlayer() : (
                                <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        sizes="(max-width: 1024px) 90vw, 800px"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {renderProjectDetails()}
                </div>

                {/* Desktop: Side by side layout with alternating positions */}
                <div className="hidden lg:block px-6">
                    <div className={`flex items-center gap-8 xl:gap-32 max-w-[1200px] mx-auto my-12 ${shouldTextBeOnLeft ? 'flex-row ' : 'flex-row-reverse'}`}>
                        {/* Video Section - Reasonable size */}
                        <div className="flex-1 max-w-[600px] xl:max-w-[650px] relative">
                            <div className="relative w-full aspect-[16/9]">
                                {project.videoUrl ? renderEnhancedVideoPlayer() : (
                                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.name}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            sizes="(max-width: 1024px) 90vw, 800px"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Icons Sidebar for horizontal videos */}
                            <div className={`absolute ${shouldTextBeOnLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                                } ${shouldTextBeOnLeft ? 'top-[15%]' : 'bottom-[15%]'
                                } w-[6%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%] bg-opacity-90
                            transition-all duration-500 ease-out aspect-[1/5] min-h-[90px] max-h-[160px]
                            group-hover:aspect-[1/6] group-hover:min-h-[120px] group-hover:max-h-[200px] z-10`}>
                                {icons.map((icon, iconIndex) => (
                                    <Icon
                                        key={iconIndex}
                                        src={icon}
                                        colorClass={colors.iconColor}
                                        className="w-[60%] h-[60%] min-w-[12px] min-h-[12px] max-w-[26px] max-h-[26px] transition-all duration-300 ease-out group-hover:scale-110"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="flex-1 max-w-[450px]">
                            <div className="flex flex-col">
                                <h3 className="text-2xl lg:text-3xl xl:text-6xl text-white font-light leading-tight mb-6 font-new-black-light">
                                    {project.name}
                                </h3>
                                <div className="space-y-3">
                                    <p className="text-gray-400 text-sm lg:text-base text-white">
                                        <span className="font-semibold text-gray-400">Client:</span> {project.client}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-gray-400 font-semibold text-sm lg:text-base">Work:</p>
                                        {project.work.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="text-white text-sm lg:text-base">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {project.description && (
                                        <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Project details component (for image and vertical projects)
    const renderProjectDetails = () => (
        <div className="flex-grow flex flex-col justify-between mt-4">
            {/* For vertical videos, match the exact container structure of the video */}
            {project.type === 'vertical' ? (
                <div className="relative w-full px-6">
                    <div className="relative w-full max-w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px] mx-auto">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl text-white font-light leading-tight">
                                    {project.name}
                                </h3>
                                <div className="mt-3 md:mt-4">
                                    <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">
                                        <span className="font-semibold">Client:</span> {project.client}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <p className="text-gray-400 font-semibold text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">Work:</p>
                                        {project.work.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="text-gray-300 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {project.description && (
                                        <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base mt-2">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2 lg:gap-3 xl:gap-4 ml-4">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-[16px] sm:h-[16px] md:w-[14px] md:h-[14px] lg:w-6 lg:h-6 xl:w-8 xl:h-8 transition-transform duration-300 ease-out hover:scale-125 cursor-pointer"
                                >
                                    <path
                                        d="M15 3H21M21 3V9M21 3L14 10"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-start px-6">
                    <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl text-white font-light leading-tight">
                            {project.name}
                        </h3>
                        <div className="mt-3 md:mt-4">
                            <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">
                                <span className="font-semibold">Client:</span> {project.client}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-gray-400 font-semibold text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">Work:</p>
                                {project.work.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="text-gray-300 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {project.description && (
                                <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base mt-2">
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-2 lg:gap-3 xl:gap-4 ml-4">
                        <Image
                            src="/Icons/columns.svg"
                            alt="details"
                            width={16}
                            height={16}
                            className="sm:w-[16px] sm:h-[16px] md:w-[14px] md:h-[14px] lg:w-5 lg:h-5 xl:w-6 xl:h-6"
                        />
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="sm:w-[16px] sm:h-[16px] md:w-[14px] md:h-[14px] lg:w-6 lg:h-6 xl:w-8 xl:h-8 transition-transform duration-300 ease-out hover:scale-125 cursor-pointer"
                        >
                            <path
                                d="M15 3H21M21 3V9M21 3L14 10"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );

    // Return appropriate layout based on project type
    switch (project.type) {
        case 'vertical':
            return renderVerticalProject();
        case 'horizontal':
            return renderHorizontalProject();
        case 'image':
        default:
            return renderImageProject();
    }
};

export default ProjectCard;
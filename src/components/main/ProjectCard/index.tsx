// src/components/main/ProjectCard/index.tsx
'use client';
import React, { useState, useRef } from 'react';
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

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const icons = ['/Icons/bird.svg', '/Icons/eye.svg', '/Icons/crown.svg'];

    const togglePlayPause = () => {
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

    // Color variations cycle through different themes
    const colorVariations = [
        { bg: 'bg-green', iconColor: 'bg-green-40' },
        { bg: 'bg-red-50', iconColor: 'bg-red-20' },
        { bg: 'bg-blue', iconColor: 'bg-blue-40' },
        { bg: 'bg-orange-50', iconColor: 'bg-orange-30' },
    ];
    const colors = colorVariations[index % 4];

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
                {/* Reduced height for vertical videos on large screens */}
                <div className="relative w-full aspect-[9/16] max-w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px] mx-auto">
                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                        {project.videoUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={project.videoUrl}
                                    poster={project.imageUrl}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    muted
                                    loop
                                    playsInline
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                                {/* Always visible play button when paused or on hover */}
                                <button
                                    onClick={togglePlayPause}
                                    className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-300 ${!isPlaying ? 'bg-opacity-30 opacity-100' : 'bg-opacity-30 opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300">
                                        {isPlaying ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="6" y="4" width="4" height="16" fill="white" />
                                                <rect x="14" y="4" width="4" height="16" fill="white" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <polygon points="8,5 19,12 8,19" fill="white" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <Image
                                src={project.imageUrl}
                                alt={project.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 280px, (max-width: 1280px) 300px, 320px"
                            />
                        )}
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

    // Render horizontal video project (full width with alternating text position)
    const renderHorizontalProject = () => {
        const shouldTextBeOnLeft = index % 2 === 0;

        return (
            <div className="w-full bg-transparent flex flex-col mb-12 group">
                {/* Mobile: Stacked layout */}
                <div className="block lg:hidden">
                    <div className="relative w-full px-6">
                        <div className="relative w-full aspect-[16/9] mx-auto">
                            {renderVideoPlayer()}
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
                                {renderVideoPlayer()}
                            </div>

                            {/* Icons Sidebar for horizontal videos - Half on/half off like other projects */}
                            <div className={`absolute ${shouldTextBeOnLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                                } ${shouldTextBeOnLeft ? 'top-[15%]' : 'bottom-[15%]'
                                } w-[6%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%] bg-opacity-90
                            transition-all duration-500 ease-out aspect-[1/5] min-h-[90px] max-h-[160px]
                            group-hover:aspect-[1/6] group-hover:min-h-[120px] group-hover:max-h-[200px]`}>
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

                                {/* Action buttons */}
                                {/* <div className="flex items-center gap-4 mt-6">
                    
                                    <svg 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="lg:w-8 lg:h-8 transition-transform duration-300 ease-out hover:scale-125 cursor-pointer"
                                    >
                                        <path 
                                            d="M15 3H21M21 3V9M21 3L14 10" 
                                            stroke="white" 
                                            strokeWidth="1.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    </svg>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Video player component for horizontal videos
    const renderVideoPlayer = () => (
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
            {project.videoUrl ? (
                <>
                    <video
                        ref={videoRef}
                        src={project.videoUrl}
                        poster={project.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        muted
                        loop
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    {/* Always visible play button when paused or on hover */}
                    <button
                        onClick={togglePlayPause}
                        className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-300 ${!isPlaying ? 'bg-opacity-30 opacity-100' : 'bg-opacity-30 opacity-0 group-hover:opacity-100'
                            }`}
                    >
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300">
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="4" width="4" height="16" fill="white" />
                                    <rect x="14" y="4" width="4" height="16" fill="white" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="8,5 19,12 8,19" fill="white" />
                                </svg>
                            )}
                        </div>
                    </button>
                </>
            ) : (
                <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 1024px) 90vw, 800px"
                />
            )}
        </div>
    );

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
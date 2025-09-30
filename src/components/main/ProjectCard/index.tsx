// src/components/main/ProjectCard/index.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Icon from '../Icon';
import VideoPlayer from '../VideoPlayer';
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
}) => {
    const router = useRouter();
    console.log('🎨 Rendering ProjectCard:', project.name, 'type:', project.type, 'category:', project.category, 'thumbnailUrl:', project.thumbnailUrl);

    // Convert project name to URL-friendly format
    const getProjectUrl = (projectName: string) => {
        return `/portfolio/${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}`;
    };

    // Handle project card click (navigate to project detail)
    const handleProjectClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on video controls
        if ((e.target as HTMLElement).closest('.video-controls')) {
            return;
        }

        const projectUrl = getProjectUrl(project.name);
        console.log('🔗 Navigating to project:', projectUrl);
        router.push(projectUrl);
    };

    const icons = ['/Icons/bird.svg', '/Icons/eye.svg', '/Icons/crown.svg'];

    // Color variations cycle through different themes
    const colorVariations = [
        { bg: 'bg-green', iconColor: 'bg-green-40' },
        { bg: 'bg-red-50', iconColor: 'bg-red-20' },
        { bg: 'bg-blue', iconColor: 'bg-blue-40' },
        { bg: 'bg-orange-50', iconColor: 'bg-orange-30' },
    ];
    const colors = colorVariations[index % 4];

    // Render video player using the reusable VideoPlayer component
    const renderVideoPlayer = () => (
        <VideoPlayer
            videoUrl={project.videoUrl || ''}
            posterUrl={project.thumbnailUrl}
            projectName={project.name}
            projectWork={project.work}
            projectType={project.type === 'vertical' ? 'vertical' : 'horizontal'}
            className="absolute inset-0"
            showProjectInfo={true}
        />
    );

    // Render image project (standard card)
    const renderImageProject = () => (
        <div className="w-full bg-transparent flex flex-col mb-8 group">
            <div className="relative w-full px-6">
                <div className="relative w-full aspect-[560/620] max-w-full md:max-w-[450px] lg:max-w-[480px] xl:max-w-[560px] mx-auto">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        {project.thumbnailUrl ? (
                            <Image
                                src={project.thumbnailUrl}
                                alt={project.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 450px, (max-width: 1280px) 480px, 560px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-400 text-lg">No Image</span>
                            </div>
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

    // Render vertical video project (shorts - smaller height)
    const renderVerticalProject = () => (
        <div className="w-full bg-transparent flex flex-col mb-8 group">
            <div className="relative w-full px-6">
                <div className="relative w-full aspect-[9/16] max-w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px] mx-auto">
                    {project.videoUrl ? (
                        renderVideoPlayer()
                    ) : (
                        <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                            {project.thumbnailUrl ? (
                                <Image
                                    src={project.thumbnailUrl}
                                    alt={project.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 280px, (max-width: 1280px) 300px, 320px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-gray-400 text-lg">No Image</span>
                                </div>
                            )}
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
                            {project.videoUrl ? renderVideoPlayer() : (
                                <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                                    {project.thumbnailUrl ? (
                                        <Image
                                            src={project.thumbnailUrl}
                                            alt={project.name}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            sizes="(max-width: 1024px) 90vw, 800px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <span className="text-gray-400 text-lg">No Image</span>
                                        </div>
                                    )}
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
                                {project.videoUrl ? renderVideoPlayer() : (
                                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                                        {project.thumbnailUrl ? (
                                            <Image
                                                src={project.thumbnailUrl}
                                                alt={project.name}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                sizes="(max-width: 1024px) 90vw, 800px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                <span className="text-gray-400 text-lg">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Icons Sidebar for horizontal videos */}
                            <div className={`absolute ${shouldTextBeOnLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                                } ${shouldTextBeOnLeft ? 'top-[15%]' : 'bottom-[15%]'
                                } w-[5%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%] bg-opacity-90
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
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h3 className="text-2xl lg:text-3xl xl:text-6xl text-white  leading-tight font-new-black-medium flex-1">
                                        {project.name}
                                    </h3>
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={handleProjectClick}
                                        className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 transition-transform duration-300 ease-out hover:scale-125 cursor-pointer mt-1"
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
                                    {/* {project.description && (
                                        <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                                            {project.description}
                                        </p>
                                    )} */}
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
                                <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl text-white font-new-black-medium leading-tight">
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
                                    {/* {project.description && (
                                        <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base mt-2">
                                            {project.description}
                                        </p>
                                    )} */}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2 lg:gap-3 xl:gap-4 ml-4">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={handleProjectClick}
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
                        <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl text-white font-new-black-medium leading-tight">
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
                            {/* {project.description && (
                                <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base mt-2">
                                    {project.description}
                                </p>
                            )} */}
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
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleProjectClick}
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
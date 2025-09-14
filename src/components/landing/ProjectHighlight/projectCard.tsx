'use client';
import React from 'react';
import Image from 'next/image';
import Icon from '../../main/Icon';
import { Project } from '@/lib/types';

interface ProjectCardProps {
    project: Project;
    index: number;
    isLeft: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isLeft }) => {
    const icons = ['/Icons/bird.svg', '/Icons/eye.svg', '/Icons/crown.svg'];

    // Color variations cycle through green, orange, blue
    const colorVariations = [
        { bg: 'bg-green', iconColor: 'bg-green-40' },
        { bg: 'bg-red-50', iconColor: 'bg-red-20' },
        { bg: 'bg-blue', iconColor: 'bg-blue-40' },
        { bg: 'bg-orange-50', iconColor: 'bg-orange-30' },
    ];
    const colors = colorVariations[index % 4];

    return (
        <div className="w-full bg-transparent flex flex-col mb-8 group">
            {/* Outer container with space for sidebars */}
            <div className="relative w-full px-6">
                {/* Image Section with responsive dimensions */}
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
                    
                    {/* Icons Sidebar - Mobile positioning (alternating left/right) */}
                    <div className={`absolute sm:hidden ${
                        index % 2 === 0 ? 'left-[-10px] top-16' : 'right-[-10px] bottom-16'
                    } w-[10%] bg-opacity-90 ${colors.bg} rounded-full flex flex-col items-center justify-center gap-[8%]
                    transition-all duration-500 ease-out
                    aspect-[1/4] group-hover:aspect-[1/5]`}>
                        {icons.map((icon, iconIndex) => (
                            <Icon 
                                key={iconIndex} 
                                src={icon} 
                                colorClass={colors.iconColor} 
                                className="w-[50%] h-[50%] max-w-[16px] max-h-[16px] transition-all duration-300 ease-out group-hover:scale-110" 
                            />
                        ))}
                    </div>
                    
                    {/* Icons Sidebar - Tablet and Desktop positioning with new formula */}
                    <div className={`absolute hidden sm:flex ${
                        isLeft 
                            ? 'left-0 -translate-x-1/2' // Left column: left side
                            : 'right-0 translate-x-1/2' // Right column: right side
                    } ${
                        isLeft 
                            ? 'top-[10%]' // Left column: top 20% of image height
                            : 'bottom-[10%]' // Right column: bottom (with 20% offset from bottom)
                    } w-[7%] min-w-[30px] max-w-[40px] ${colors.bg} rounded-full flex-col items-center justify-center gap-[8%] bg-opacity-90
                    transition-all duration-500 ease-out
                    aspect-[1/5] min-h-[90px] max-h-[180px]
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

            {/* Details Section - aligned with image */}
            <div className="flex-grow flex flex-col justify-between mt-4 px-6">
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
            </div>
        </div>
    );
};

export default ProjectCard;
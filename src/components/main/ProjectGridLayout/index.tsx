// src/components/main/ProjectGridLayout/index.tsx
'use client';
import React from 'react';
import ProjectCard from '../ProjectCard';
import { Project } from '@/lib/types';

interface ProjectGridLayoutProps {
    projects: Project[];
    layout?: 'highlight' | 'portfolio';
}

const ProjectGridLayout: React.FC<ProjectGridLayoutProps> = ({ 
    projects, 
    layout = 'portfolio' 
}) => {
    console.log('📊 ProjectGridLayout rendering with layout:', layout, 'projects:', projects.length);

    // Separate projects by type
    const imageProjects = projects.filter(p => p.type === 'image');
    const horizontalProjects = projects.filter(p => p.type === 'horizontal');
    const verticalProjects = projects.filter(p => p.type === 'vertical');

    // For zigzag layout, we need to mix image and vertical projects
    const zigzagProjects = [...imageProjects, ...verticalProjects];

    return (
        <div className="flex justify-center w-full px-4 overflow-visible">
            {/* Container with proper overflow handling */}
            <div className="w-full max-w-[1000px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1400px] 2xl:max-w-[1600px] overflow-visible">
                
                {/* Horizontal Videos - Full Width Section with extra spacing */}
                {horizontalProjects.length > 0 && (
                    <div className="w-full mb-20 overflow-visible">
                        <div className="space-y-16 lg:space-y-20">
                            {horizontalProjects.map((project, index) => (
                                <div key={project.id} className="relative overflow-visible">
                                    <ProjectCard 
                                        project={project} 
                                        index={index}
                                        layout="fullwidth"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Zigzag Layout for Image and Vertical Projects */}
                {zigzagProjects.length > 0 && (
                    <>
                        {/* Mobile: Single column */}
                        <div className="block md:hidden">
                            <div className="flex flex-col items-center gap-8">
                                {zigzagProjects.map((project, index) => (
                                    <div key={project.id} className="w-full max-w-[400px]">
                                        <ProjectCard 
                                            project={project} 
                                            index={index + horizontalProjects.length}
                                            isLeft={index % 2 === 0}
                                            layout="zigzag"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Two columns with zigzag layout */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 xl:gap-x-16">
                                {/* Left Column - Align right (towards center) */}
                                <div className="flex flex-col items-end gap-10 md:gap-12">
                                    {zigzagProjects
                                        .filter((_, index) => index % 2 === 0)
                                        .map((project, idx) => {
                                            const originalIndex = (idx * 2) + horizontalProjects.length;
                                            return (
                                                <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard 
                                                        project={project} 
                                                        index={originalIndex}
                                                        isLeft={true}
                                                        layout="zigzag"
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>

                                {/* Right Column - Align left (towards center) with top offset */}
                                <div className="flex flex-col items-start gap-10 md:gap-12 mt-16 md:mt-20 lg:mt-24 xl:mt-32">
                                    {zigzagProjects
                                        .filter((_, index) => index % 2 === 1)
                                        .map((project, idx) => {
                                            const originalIndex = (idx * 2) + 1 + horizontalProjects.length;
                                            return (
                                                <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard 
                                                        project={project} 
                                                        index={originalIndex}
                                                        isLeft={false}
                                                        layout="zigzag"
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Empty state */}
                {projects.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-new-black font-light text-gray-400 mb-4">
                            No projects found
                        </h3>
                        <p className="text-gray-500">
                            Try selecting a different category to see our work.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectGridLayout;
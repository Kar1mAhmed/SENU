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
    console.log('📊 Projects order received:', projects.map(p => p.name));

    return (
        <div className="flex justify-center w-full px-4 overflow-visible">
            {/* Container with proper overflow handling */}
            <div className="w-full max-w-[1000px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1400px] 2xl:max-w-[1600px] overflow-visible">
                {/* Mobile: Single column for all */}
                <div className="block md:hidden">
                    <div className="flex flex-col items-center gap-8">
                        {projects.map((project, index) => {
                            if (project.type === 'horizontal') {
                                return (
                                    <div key={project.id} className="w-full relative overflow-visible">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            layout="fullwidth"
                                        />
                                    </div>
                                );
                            }
                            
                            // Calculate zigzag position
                            const zigzagIndex = projects.slice(0, index).filter(p => p.type === 'image' || p.type === 'vertical').length;
                            const isLeft = zigzagIndex % 2 === 0;
                            
                            return (
                                <div key={project.id} className="w-full max-w-[400px]">
                                    <ProjectCard 
                                        project={project} 
                                        index={index}
                                        isLeft={isLeft}
                                        layout="zigzag"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop: Zigzag layout with full-width interruptions */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 xl:gap-x-16">
                        {/* Left Column */}
                        <div className="flex flex-col items-end gap-10 md:gap-12">
                            {projects.map((project, index) => {
                                if (project.type === 'horizontal') return null;
                                
                                const zigzagIndex = projects.slice(0, index).filter(p => p.type === 'image' || p.type === 'vertical').length;
                                const isLeft = zigzagIndex % 2 === 0;
                                
                                if (!isLeft) return null;
                                
                                return (
                                    <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            isLeft={true}
                                            layout="zigzag"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column with offset */}
                        <div className="flex flex-col items-start gap-10 md:gap-12 mt-16 md:mt-20 lg:mt-24 xl:mt-32">
                            {projects.map((project, index) => {
                                if (project.type === 'horizontal') return null;
                                
                                const zigzagIndex = projects.slice(0, index).filter(p => p.type === 'image' || p.type === 'vertical').length;
                                const isLeft = zigzagIndex % 2 === 0;
                                
                                if (isLeft) return null;
                                
                                return (
                                    <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            isLeft={false}
                                            layout="zigzag"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Horizontal videos - rendered separately after zigzag */}
                    {projects.filter(p => p.type === 'horizontal').length > 0 && (
                        <div className="w-full mt-20">
                            <div className="space-y-16 lg:space-y-20">
                                {projects.map((project, index) => {
                                    if (project.type !== 'horizontal') return null;
                                    
                                    return (
                                        <div key={project.id} className="w-full relative overflow-visible">
                                            <ProjectCard 
                                                project={project} 
                                                index={index}
                                                layout="fullwidth"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

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
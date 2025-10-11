// src/components/main/ProjectGridLayout/index.tsx
'use client';
import React from 'react';
import ProjectCard from '../ProjectCard';
import { Project } from '@/lib/types';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

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
                    <StaggerContainer staggerDelay={0.15} className="flex flex-col items-center gap-8">
                        {projects.map((project, index) => {
                            if (project.type === 'horizontal') {
                                return (
                                    <StaggerItem key={project.id} direction="up" className="w-full relative overflow-visible">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            layout="fullwidth"
                                        />
                                    </StaggerItem>
                                );
                            }
                            
                            // Calculate zigzag position
                            const zigzagIndex = projects.slice(0, index).filter(p => p.type === 'image' || p.type === 'vertical').length;
                            const isLeft = zigzagIndex % 2 === 0;
                            
                            return (
                                <StaggerItem key={project.id} direction="up" className="w-full max-w-[400px]">
                                    <ProjectCard 
                                        project={project} 
                                        index={index}
                                        isLeft={isLeft}
                                        layout="zigzag"
                                    />
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>

                {/* Desktop: Exact DB order with proper zigzag */}
                <div className="hidden md:block">
                    {(() => {
                        const elements: React.ReactElement[] = [];
                        let currentZigzagBatch: typeof projects = [];
                        
                        projects.forEach((project, index) => {
                            if (project.type === 'horizontal') {
                                // Render any accumulated zigzag projects first
                                if (currentZigzagBatch.length > 0) {
                                    elements.push(
                                        <div key={`zigzag-${index}`} className="grid grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 xl:gap-x-16 mb-20">
                                            <StaggerContainer staggerDelay={0.15} className="flex flex-col items-end gap-10 md:gap-12">
                                                {currentZigzagBatch.map((p, i) => {
                                                    if (i % 2 !== 0) return null;
                                                    return (
                                                        <StaggerItem key={p.id} direction="left" className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                            <ProjectCard project={p} index={projects.indexOf(p)} isLeft={true} layout="zigzag" />
                                                        </StaggerItem>
                                                    );
                                                })}
                                            </StaggerContainer>
                                            <StaggerContainer staggerDelay={0.15} className="flex flex-col items-start gap-10 md:gap-12 mt-16 md:mt-20 lg:mt-24 xl:mt-32">
                                                {currentZigzagBatch.map((p, i) => {
                                                    if (i % 2 === 0) return null;
                                                    return (
                                                        <StaggerItem key={p.id} direction="right" className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                            <ProjectCard project={p} index={projects.indexOf(p)} isLeft={false} layout="zigzag" />
                                                        </StaggerItem>
                                                    );
                                                })}
                                            </StaggerContainer>
                                        </div>
                                    );
                                    currentZigzagBatch = [];
                                }
                                
                                // Render horizontal video
                                elements.push(
                                    <StaggerItem key={project.id} direction="up" className="w-full mb-20">
                                        <ProjectCard project={project} index={index} layout="fullwidth" />
                                    </StaggerItem>
                                );
                            } else {
                                // Add to zigzag batch
                                currentZigzagBatch.push(project);
                            }
                        });
                        
                        // Render any remaining zigzag projects
                        if (currentZigzagBatch.length > 0) {
                            elements.push(
                                <div key="zigzag-final" className="grid grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 xl:gap-x-16">
                                    <StaggerContainer staggerDelay={0.15} className="flex flex-col items-end gap-10 md:gap-12">
                                        {currentZigzagBatch.map((p, i) => {
                                            if (i % 2 !== 0) return null;
                                            return (
                                                <StaggerItem key={p.id} direction="left" className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard project={p} index={projects.indexOf(p)} isLeft={true} layout="zigzag" />
                                                </StaggerItem>
                                            );
                                        })}
                                    </StaggerContainer>
                                    <StaggerContainer staggerDelay={0.15} className="flex flex-col items-start gap-10 md:gap-12 mt-16 md:mt-20 lg:mt-24 xl:mt-32">
                                        {currentZigzagBatch.map((p, i) => {
                                            if (i % 2 === 0) return null;
                                            return (
                                                <StaggerItem key={p.id} direction="right" className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard project={p} index={projects.indexOf(p)} isLeft={false} layout="zigzag" />
                                                </StaggerItem>
                                            );
                                        })}
                                    </StaggerContainer>
                                </div>
                            );
                        }
                        
                        return elements;
                    })()}
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
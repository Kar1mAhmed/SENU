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

    // Track zigzag counter for proper left/right alternation
    let zigzagCounter = 0;

    return (
        <div className="flex justify-center w-full px-4 overflow-visible">
            {/* Container with proper overflow handling */}
            <div className="w-full max-w-[1000px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1400px] 2xl:max-w-[1600px] overflow-visible">
                <div className="space-y-16 lg:space-y-20">
                    {projects.map((project, index) => {
                        // Horizontal projects get full-width layout
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
                        
                        // Image and vertical projects get zigzag layout
                        const isLeft = zigzagCounter % 2 === 0;
                        zigzagCounter++;
                        
                        return (
                            <div key={project.id} className="w-full">
                                {/* Mobile: Centered */}
                                <div className="flex md:hidden justify-center">
                                    <div className="w-full max-w-[400px]">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            isLeft={isLeft}
                                            layout="zigzag"
                                        />
                                    </div>
                                </div>
                                
                                {/* Desktop: Zigzag */}
                                <div className="hidden md:flex justify-center">
                                    <div className={`w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px] ${
                                        isLeft 
                                            ? 'md:mr-auto md:pr-4 lg:pr-8 xl:pr-12' 
                                            : 'md:ml-auto md:pl-4 lg:pl-8 xl:pl-12'
                                    }`}>
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            isLeft={isLeft}
                                            layout="zigzag"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
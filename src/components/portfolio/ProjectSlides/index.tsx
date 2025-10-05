'use client';
import React from 'react';
import { ProjectSlide, ProjectType } from '@/lib/types';
import ImageSlides from './ImageSlides';
import VerticalSlides from './VerticalSlides';
import HorizontalSlides from './HorizontalSlides';

interface ProjectSlidesProps {
    slides: ProjectSlide[];
    projectType: ProjectType;
}

console.log('🎯 ProjectSlides component loaded - ready to route to appropriate slide type!');

const ProjectSlides: React.FC<ProjectSlidesProps> = ({ slides, projectType }) => {
    // Early return if no slides
    if (!slides || slides.length === 0) {
        return (
            <section id="projectSlides" className="py-16">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                    <div className="text-center text-gray-400">
                        <p>No slides available for this project.</p>
                    </div>
                </div>
            </section>
        );
    }

    // Route to appropriate component based on project type
    // Wrap each component in a section with ID for navbar scroll detection
    switch (projectType) {
        case 'image':
            return (
                <section id="projectSlides">
                    <ImageSlides slides={slides} />
                </section>
            );
        
        case 'vertical':
            return (
                <section id="projectSlides">
                    <VerticalSlides slides={slides} />
                </section>
            );
        
        case 'horizontal':
            return (
                <section id="projectSlides">
                    <HorizontalSlides slides={slides} />
                </section>
            );
        
        default:
            return (
                <section id="projectSlides" className="py-16">
                    <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                        <div className="text-center text-gray-400">
                            <p>Unsupported project type: {projectType}</p>
                        </div>
                    </div>
                </section>
            );
    }
};

export default ProjectSlides;

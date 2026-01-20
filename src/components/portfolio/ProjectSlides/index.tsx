'use client';
import React from 'react';
import { ProjectSlide } from '@/lib/types';
import SingleSlide from './SingleSlide';

interface ProjectSlidesProps {
    slides: ProjectSlide[];
}

console.log('🎯 ProjectSlides component loaded - ready to route to appropriate slide type!');

const ProjectSlides: React.FC<ProjectSlidesProps> = ({ slides }) => {
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

    // Sort slides by order
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

    return (
        <section id="projectSlides" className="w-full pb-20">
            <div className="flex flex-col">
                {sortedSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${slide.type === 'image'
                            ? 'w-full'
                            : 'max-w-[1280px] mx-auto px-4 lg:px-0 w-full py-16'
                            }`}
                    >
                        <SingleSlide slide={slide} index={index} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectSlides;

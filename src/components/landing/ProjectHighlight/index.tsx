'use client';
import React, { useState } from 'react';
import { mockProjects } from '@/lib/mock-data';
import ProjectCard from './projectCard';

const categories = [
    'All',
    'Branding',
    'Logo design',
    'UI/UX',
    'Products',
    'Prints',
    'Motions',
    'Shorts',
];

const ProjectHighlight: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProjects = activeCategory === 'All'
        ? mockProjects.slice(0, 4) // Limit to 4 for the zig-zag layout
        : mockProjects.filter(p => p.category === activeCategory).slice(0, 4);

    return (
        <section className="py-16 md:py-20">
            {/* Full width container for everything */}
            <div className="w-full">
                {/* Title */}
                <h2 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl text-center mb-12">
                    Our Projects <span className="font-medium">Highlight</span>
                </h2>
                
                {/* Category buttons - centered */}
                <div className="flex justify-center mb-16">
                    <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 no-scrollbar px-4" id="category-buttons">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 w-[143px] h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-[#474747]/20 border-[2px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] hover:text-white'
                                }`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects container - constrained width and centered */}
                <div className="flex justify-center w-full px-4">
                    {/* Adjusted max-width for smaller cards */}
                    <div className="w-full max-w-[1000px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                        {/* Mobile: Single column */}
                        <div className="block md:hidden">
                            <div className="flex flex-col items-center gap-8">
                                {filteredProjects.map((project, index) => (
                                    <div key={project.id} className="w-full max-w-[400px]">
                                        <ProjectCard 
                                            project={project} 
                                            index={index}
                                            isLeft={index % 2 === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Two columns with moderate spacing */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 xl:gap-x-16">
                                {/* Left Column - Align right (towards center) */}
                                <div className="flex flex-col items-end gap-10 md:gap-12">
                                    {filteredProjects
                                        .filter((_, index) => index % 2 === 0)
                                        .map((project, idx) => {
                                            const originalIndex = idx * 2;
                                            return (
                                                <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard 
                                                        project={project} 
                                                        index={originalIndex}
                                                        isLeft={true}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>

                                {/* Right Column - Align left (towards center) with top offset */}
                                <div className="flex flex-col items-start gap-10 md:gap-12 mt-16 md:mt-20 lg:mt-24 xl:mt-32">
                                    {filteredProjects
                                        .filter((_, index) => index % 2 === 1)
                                        .map((project, idx) => {
                                            const originalIndex = (idx * 2) + 1;
                                            return (
                                                <div key={project.id} className="w-full max-w-[450px] lg:max-w-[480px] xl:max-w-[500px]">
                                                    <ProjectCard 
                                                        project={project} 
                                                        index={originalIndex}
                                                        isLeft={false}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectHighlight;
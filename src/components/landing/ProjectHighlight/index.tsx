'use client';
import React, { useState } from 'react';
import { mockProjects } from '@/lib/mock-data';
import ProjectGridLayout from '../../main/ProjectGridLayout';

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
        ? mockProjects.slice(0, 6) // Increased to show more projects including horizontal ones
        : mockProjects.filter(p => p.category === activeCategory).slice(0, 6);

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
                                        : 'bg-[#474747]/20 border-[1px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] hover:text-white'
                                }`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Use the same ProjectGridLayout component as portfolio */}
                <ProjectGridLayout 
                    projects={filteredProjects}
                    layout="highlight"
                />
            </div>
        </section>
    );
};

export default ProjectHighlight;
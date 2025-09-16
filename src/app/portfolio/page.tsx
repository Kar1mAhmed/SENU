'use client';
import React, { useState } from 'react';
import { mockProjects } from '@/lib/mock-data';
import ProjectCard from '@/components/main/ProjectCard';

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

const Portfolio: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    console.log('🎯 Portfolio page loaded with category:', activeCategory);

    const filteredProjects = activeCategory === 'All'
        ? mockProjects // Show all projects without limit
        : mockProjects.filter(p => p.category === activeCategory);

    console.log('📊 Filtered projects count:', filteredProjects.length, 'for category:', activeCategory);

    // Group projects by type for better organization
    const imageProjects = filteredProjects.filter(p => p.type === 'image');
    const horizontalProjects = filteredProjects.filter(p => p.type === 'horizontal');
    const verticalProjects = filteredProjects.filter(p => p.type === 'vertical');

    console.log('📸 Project breakdown - Images:', imageProjects.length, 'Horizontal:', horizontalProjects.length, 'Vertical:', verticalProjects.length);

    return (
        <div className="min-h-screen bg-black text-white">
            <section className="py-16 md:py-20">
                {/* Full width container for everything */}
                <div className="w-full">
                    {/* Title */}
                    <h1 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl lg:text-7xl text-center mb-12">
                        Our <span className="font-medium">Portfolio</span>
                    </h1>
                    
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

                    {/* Projects container - constrained width and centered like ProjectHighlight */}
                    <div className="flex justify-center w-full px-4">
                        {/* Bigger max-width than ProjectHighlight for portfolio */}
                        <div className="w-full max-w-[1200px] md:max-w-[1300px] lg:max-w-[1400px] xl:max-w-[1600px]">
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

                            {/* Desktop: Two columns with zig-zag layout - exactly like ProjectHighlight */}
                            <div className="hidden md:block">
                                <div className="grid grid-cols-1 gap-x-8 md:gap-x-10 lg:gap-x-16 xl:gap-x-20">
                                    {/* Left Column - Align right (towards center) */}
                                    <div className="flex flex-col items-end gap-12 md:gap-14 lg:gap-16">
                                        {filteredProjects
                                            .filter((_, index) => index % 2 === 0)
                                            .map((project, idx) => {
                                                const originalIndex = idx * 2;
                                                return (
                                                    <div key={project.id} className="w-full max-w-[500px] lg:max-w-[550px] xl:max-w-[600px]">
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
                                    <div className="flex flex-col items-start gap-12 md:gap-14 lg:gap-16 mt-20 md:mt-24 lg:mt-32 xl:mt-40">
                                        {filteredProjects
                                            .filter((_, index) => index % 2 === 1)
                                            .map((project, idx) => {
                                                const originalIndex = (idx * 2) + 1;
                                                return (
                                                    <div key={project.id} className="w-full max-w-[500px] lg:max-w-[550px] xl:max-w-[600px]">
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

                    {/* Empty state */}
                    {filteredProjects.length === 0 && (
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
            </section>
        </div>
    );
};

export default Portfolio;

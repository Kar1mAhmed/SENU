'use client';
import React, { useState } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useCategories } from '@/lib/hooks/useCategories';
import ProjectGridLayout from '../../main/ProjectGridLayout';
import FadeIn from '@/components/animations/FadeIn';

const ProjectHighlight: React.FC = () => {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

    // Fetch categories from backend
    const { categories, loading: categoriesLoading } = useCategories();

    // Fetch projects from backend with limit of 6 for highlights
    const { projects, loading, error } = useProjects({ 
        categoryId: activeCategoryId || undefined,
        limit: 6 
    });

    // Take only first 6 projects for highlights
    const filteredProjects = projects.slice(0, 6);

    // Build categories array with 'All' option
    const categoryOptions = ['All', ...categories.map(cat => cat.name)];
    const activeCategoryName = activeCategoryId === null ? 'All' : categories.find(c => c.id === activeCategoryId)?.name || 'All';

    return (
        <section className="py-16 md:py-20">
            {/* Full width container for everything */}
            <div className="w-full">
                {/* Title */}
                <FadeIn direction="up" duration={0.8}>
                    <h2 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl text-center mb-12">
                        Our Projects <span className="font-medium">Highlight</span>
                    </h2>
                </FadeIn>
                
                {/* Category buttons - centered */}
                {categoriesLoading ? (
                    <div className="flex justify-center mb-16">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <FadeIn direction="up" delay={0.2}>
                        <div className="flex justify-center mb-16">
                            <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 no-scrollbar px-4" id="category-buttons">
                            {categoryOptions.map((categoryName) => (
                                <button
                                    key={categoryName}
                                    onClick={() => {
                                        if (categoryName === 'All') {
                                            setActiveCategoryId(null);
                                        } else {
                                            const category = categories.find(c => c.name === categoryName);
                                            if (category) setActiveCategoryId(category.id);
                                        }
                                    }}
                                    className={`px-6 w-[143px] h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                                        activeCategoryName === categoryName
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-[#474747]/20 border-[1px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] hover:text-white'
                                    }`}>
                                    {categoryName}
                                </button>
                            ))}
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading projects...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400">Failed to load projects. Showing empty state.</p>
                    </div>
                )}

                {/* Use the same ProjectGridLayout component as portfolio */}
                {!loading && !error && (
                    <ProjectGridLayout 
                        projects={filteredProjects}
                        layout="highlight"
                    />
                )}
            </div>
        </section>
    );
};

export default ProjectHighlight;
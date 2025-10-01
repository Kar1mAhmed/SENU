// src/app/portfolio/page.tsx
'use client';
import React, { useState } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useCategories } from '@/lib/hooks/useCategories';
import ProjectGridLayout from '@/components/main/ProjectGridLayout';
import CategoryFilter from '@/components/main/CategoryFilter';
import SingleRibbon from '@/components/main/SingleRibbon';
import Footer from '@/components/main/Footer';
import Navbar from '@/components/main/Navbar';

const Portfolio: React.FC = () => {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

    console.log('🎯 Portfolio page loaded with categoryId:', activeCategoryId);

    // Fetch categories from backend
    const { categories, loading: categoriesLoading } = useCategories();

    // Fetch projects from backend
    const { projects: filteredProjects, loading, error } = useProjects({ 
        categoryId: activeCategoryId || undefined
    });

    console.log('📊 Filtered projects count:', filteredProjects.length, 'for categoryId:', activeCategoryId);

    // Build categories array with 'All' option
    const categoryOptions = ['All', ...categories.map(cat => cat.name)];
    const activeCategoryName = activeCategoryId === null ? 'All' : categories.find(c => c.id === activeCategoryId)?.name || 'All';

    return (
        <>
        <Navbar />
        <div className="min-h-screen text-white mt-32">
            <section className="py-16 md:py-20">
                <div className="w-full">
                    {/* Title */}
                    <h1 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl lg:text-7xl text-center mb-12">
                        Our <span className="font-medium">Portfolio</span>
                    </h1>
                    
                    {/* Category Filter */}
                    {categoriesLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    ) : (
                        <CategoryFilter 
                            categories={categoryOptions}
                            activeCategory={activeCategoryName}
                            onCategoryChange={(categoryName) => {
                                if (categoryName === 'All') {
                                    setActiveCategoryId(null);
                                } else {
                                    const category = categories.find(c => c.name === categoryName);
                                    if (category) setActiveCategoryId(category.id);
                                }
                            }}
                        />
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
                            <p className="text-red-400">Failed to load projects. Please try again later.</p>
                        </div>
                    )}

                    {/* Projects Grid */}
                    {!loading && !error && (
                        <ProjectGridLayout 
                            projects={filteredProjects}
                            layout="portfolio"
                        />
                    )}
                </div>
            </section>
            <SingleRibbon bgClass="bg-red" iconColorClass="bg-red-20" heightClass="h-[35px] md:h-[45px]"/>
            <Footer />
        </div>
        </>
    );
};

export default Portfolio;
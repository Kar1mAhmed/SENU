// src/app/portfolio/page.tsx
'use client';
import React, { useState } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import ProjectGridLayout from '@/components/main/ProjectGridLayout';
import CategoryFilter from '@/components/main/CategoryFilter';
import SingleRibbon from '@/components/main/SingleRibbon';
import Footer from '@/components/main/Footer';
import Navbar from '@/components/main/Navbar';
import { ProjectCategory } from '@/lib/types';

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
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All');

    console.log('🎯 Portfolio page loaded with category:', activeCategory);

    // Fetch projects from backend
    const { projects: filteredProjects, loading, error } = useProjects({ 
        category: activeCategory 
    });

    console.log('📊 Filtered projects count:', filteredProjects.length, 'for category:', activeCategory);

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
                    <CategoryFilter 
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={(category) => setActiveCategory(category as ProjectCategory | 'All')}
                    />

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
            <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]"/>
            <Footer />
        </div>
        </>
    );
};

export default Portfolio;
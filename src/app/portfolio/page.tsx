// src/app/portfolio/page.tsx
'use client';
import React, { useState } from 'react';
import { mockProjects } from '@/lib/mock-data';
import ProjectGridLayout from '@/components/main/ProjectGridLayout';
import CategoryFilter from '@/components/main/CategoryFilter';
import SingleRibbon from '@/components/main/SingleRibbon';
import Footer from '@/components/main/Footer';

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

    return (
        <div className="min-h-screen text-white">
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
                        onCategoryChange={setActiveCategory}
                    />

                    {/* Projects Grid */}
                    <ProjectGridLayout 
                        projects={filteredProjects}
                        layout="portfolio"
                    />
                </div>
            </section>
            <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]"/>
            <Footer />
        </div>
    );
};

export default Portfolio;
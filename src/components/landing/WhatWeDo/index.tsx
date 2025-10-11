"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/lib/hooks/useCategories';
import ServiceCard from './ServiceCard';
import type { Service } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

console.log('🎨 WhatWeDo component loaded - showcasing our services dynamically!');

// Static service data for images and descriptions
const serviceData = [
    {
        description: 'Crafting complete visual identities and brand worlds from the ground up.',
        imageSrc: '/images/covers/7.jpg',
        projectCount: "20+"
    },
    {
        description: 'Creating cinematic, story-driven YouTube videos that hook viewers from the first second.',
        imageSrc: '/images/covers/8.jpg',
        projectCount: "150+"

    },
    {
        description: 'Eye-catching motion graphics that bring ideas to life.',
        imageSrc: '/images/covers/5.jpg',
        projectCount: "40+"

    },
    {
        description: 'Engaging short-form videos built to capture attention fast.',
        imageSrc: '/images/covers/6.jpg',
        projectCount: "500+"
    },
];

const WhatWeDo: React.FC = () => {
    const router = useRouter();
    const { categories, loading: categoriesLoading } = useCategories();
    return (
        <section className="w-full py-16 md:py-20">
            <div className="w-full">
                {/* Title */}
                <FadeIn direction="up" duration={0.8}>
                    <h2 className="font-new-black text-white font-m text-4xl md:text-7xl text-center mb-16 md:mb-20">
                        What We Do
                    </h2>
                </FadeIn>

                {/* Services Grid - Aligned with BackgroundGrid like Impact Section */}
                {categoriesLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                ) : (
                    <div className="w-full h-full">
                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-4 md:grid-rows-2 lg:grid-rows-1 gap-y-8 md:gap-y-8 lg:gap-y-0 h-full w-full">
                            {categories.slice(0, 4).map((category, index) => {
                                // Count projects for this category
                                
                                // Create service object
                                const service: Service = {
                                    id: category.id.toString(),
                                    title: category.name,
                                    description: serviceData[index]?.description || 'high-quality image or video showcasing your best work.',
                                    imageSrc: serviceData[index]?.imageSrc || '/images/covers/5.jpg',
                                    projectsCount: serviceData[index]?.projectCount || '2',
                                    accentColor: '',
                                };

                                return (
                                    <StaggerItem
                                        key={category.id}
                                        direction="up"
                                        className="flex justify-center items-center px-3 md:px-4 lg:px-6 cursor-pointer"
                                    >
                                        <div
                                            className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px]"
                                            onClick={() => {
                                                // Navigate to portfolio with category selected
                                                router.push(`/portfolio?categoryId=${category.id}`);
                                            }}
                                        >
                                            <ServiceCard service={service} />
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WhatWeDo;
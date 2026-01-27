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

const serviceData = [
    {
        title: 'Branding',
        projectsCount: '20+',
        description: 'Developing unique brand identities and visual strategies that resonate with your audience.',
        imageSrc: '/images/covers/7.webp',
    },
    {
        title: 'Video Editing',
        projectsCount: '300+',
        description: 'Professional video production and editing to tell your story effectively.',
        imageSrc: '/images/covers/8.webp',
    },
    {
        title: 'Social Media Designs',
        projectsCount: '150+',
        description: 'Creative and engaging designs tailored for all social media platforms.',
        imageSrc: '/images/covers/5.webp',
    },
    {
        title: 'Motion Graphics',
        projectsCount: '60+',
        description: 'Bringing animations and static designs to life with dynamic motion graphics.',
        imageSrc: '/images/covers/6.webp',
    },
];

const WhatWeDo: React.FC = () => {
    const router = useRouter();

    return (
        <section className="w-full py-16 md:py-20">
            <div className="w-full">
                {/* Title */}
                <FadeIn direction="up" duration={0.8}>
                    <h2 className="font-new-black text-white font-m text-4xl md:text-7xl text-center mb-16 md:mb-20">
                        What We Do
                    </h2>
                </FadeIn>

                {/* Static Services Grid */}
                <div className="w-full h-full">
                    <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-0 h-full w-full">
                        {serviceData.map((data, index) => {
                            const service: Service = {
                                id: index.toString(),
                                title: data.title,
                                description: data.description,
                                imageSrc: data.imageSrc,
                                projectsCount: data.projectsCount,
                                accentColor: '',
                            };

                            return (
                                <StaggerItem
                                    key={index}
                                    direction="up"
                                    className="flex justify-center items-center px-3 md:px-4 lg:px-6 w-full"
                                >
                                    <div
                                        className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px] cursor-pointer mt-4 md:mt-2"
                                        onClick={() => {
                                            router.push(`/portfolio`);
                                        }}
                                    >
                                        <ServiceCard service={service} />
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
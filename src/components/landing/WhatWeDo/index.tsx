"use client";
import React from 'react';
import ServiceCard from './ServiceCard';
import type { Service } from '@/lib/types';

const services: Service[] = [
    {
        id: 'graphic',
        title: 'graphic design',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/covers/5.jpg',
        projectsCount: 10,
        accentColor: '',
    },
    {
        id: 'shorts',
        title: 'Shorts',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/covers/6.jpg',
        projectsCount: 10,
        accentColor: '',
    },
    {
        id: 'branding',
        title: 'Branding',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/covers/7.jpg',
        projectsCount: 10,
        accentColor: '',
    },
    {
        id: 'motion',
        title: 'Motion Graphics',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/covers/8.jpg',
        projectsCount: 10,
        accentColor: '',
    },
];

const WhatWeDo: React.FC = () => {
    return (
        <section className="w-full py-16 md:py-20">
            <div className="w-full">
                {/* Title */}
                <h2 className="font-new-black text-white font-m text-4xl md:text-7xl text-center mb-16 md:mb-20">
                    What We Do
                </h2>

                {/* Services Grid - Aligned with BackgroundGrid like Impact Section */}
                <div className="w-full h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-4 md:grid-rows-2 lg:grid-rows-1 gap-y-8 md:gap-y-8 lg:gap-y-0 h-full w-full">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="flex justify-center items-center px-3 md:px-4 lg:px-6"
                            >
                                <div className="w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px]">
                                    <ServiceCard service={service} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
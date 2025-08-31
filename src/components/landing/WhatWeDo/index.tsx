"use client";
import React from 'react';
import ServiceCard from './ServiceCard';
import type { Service } from '@/lib/types';

const services: Service[] = [
    {
        id: 'graphic',
        title: 'graphic design',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/service-graphic-design.jpg',
        projectsCount: 10,
        accentColor: '#157A6E',
    },
    {
        id: 'shorts',
        title: 'Shorts',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/service-uiux.jpg',
        projectsCount: 10,
        accentColor: '#C13C1B',
    },
    {
        id: 'branding',
        title: 'Branding',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/service-branding.jpg',
        projectsCount: 10,
        accentColor: '#8B5A9F',
    },
    {
        id: 'motion',
        title: 'Motion Graphics',
        description: 'high-quality image or video showcasing your best work.',
        imageSrc: '/images/service-motion-graphics.jpg',
        projectsCount: 10,
        accentColor: '#0055D1',
    },
];

const WhatWeDo: React.FC = () => {
    return (
        <section className="w-full py-16 md:py-20 overflow-hidden">
            <div className="max-w-10xl px-4 md:px-6">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="font-new-black text-white font-light text-4xl md:text-7xl">What We Do</h2>
                </div>
                                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-4">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;

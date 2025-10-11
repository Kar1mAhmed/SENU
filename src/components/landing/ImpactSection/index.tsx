'use client';
import React from 'react';
import Icon from '../../main/Icon';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';


interface Metric {
    id: string;
    value: string;
    label: string;
    description: string;
    colorClass: string;
}

interface MetricsSectionProps {
    className?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ className = '' }) => {
    console.log('🚀 MetricsSection rendering with style that hits harder than our coffee');
    const icons = ['/Icons/eye.svg', '/Icons/bird.svg', '/Icons/crown.svg', '/Icons/columns.svg'];
    const colorVariations = [
        { bg: 'bg-green', iconColor: 'bg-green-40' },
        { bg: 'bg-red-50', iconColor: 'bg-red-20' },
        { bg: 'bg-blue', iconColor: 'bg-blue-40' },
        { bg: 'bg-yellow', iconColor: 'bg-yellow-light' },
    ];
    const metrics: Metric[] = [
        {
            id: '1',
            value: '70M+',
            label: 'Views Gained',
            description: 'Views gained on all platforms',
            colorClass: 'bg-green'
        },
        {
            id: '2',
            value: '45%',
            label: 'Engagement Boost',
            description: 'Average increase in engagement for our clients',
            colorClass: 'bg-blue'
        },
        {
            id: '3',
            value: '620+',
            label: 'Projects Delivered',
            description: 'Successful projects completed',
            colorClass: 'bg-red-50'
        },
        {
            id: '4',
            value: '195+',
            label: 'Clients',
            description: 'Clients worked with us',
            colorClass: 'bg-orange-50'
        }
    ];

    return (
        <section className={`py-16 md:py-20 ${className}`}>
            <div className="w-full">
                {/* Title */}
                <FadeIn direction="up" duration={0.8}>
                    <h2 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl text-center mb-12">
                        Our <span className="font-medium">Impact</span>
                    </h2>
                </FadeIn>

                {/* Metrics Grid - Aligned with BackgroundGrid */}
                <div className="w-full h-full">
                    <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 md:grid-rows-1 gap-y-8 md:gap-y-0 h-full w-full">
                        {metrics.map((metric, index) => (
                            <StaggerItem
                                key={metric.id}
                                direction="up"
                                className="flex justify-center items-center px-3 md:px-4 lg:px-6 group"
                            >
                                <div className="bg-black border-[#474747]/20 border rounded-lg mt-4 md:mt-2 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center w-full max-w-[260px] md:max-w-[300px] lg:max-w-[360px] h-[200px] md:h-[240px] lg:h-[280px] 
                                transition-transform duration-300 hover:scale-105">
                                    
                                    {/* Icon/Accent */}
                                    <div className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 ${colorVariations[index].bg} rounded-full mb-3 md:mb-4 lg:mb-6 flex items-center justify-center`}>
                                        <Icon
                                            src={icons[index]}
                                            colorClass={colorVariations[index].iconColor}
                                            className="w-[60%] h-[60%] min-w-[10px] min-h-[10px] max-w-[24px] max-h-[24px]"
                                        />
                                    </div>

                                    {/* Value */}
                                    <h3 className="text-xl md:text-2xl lg:text-4xl text-white font-light mb-2">
                                        {metric.value}
                                    </h3>

                                    {/* Label */}
                                    <p className="text-white font-medium text-xs md:text-sm lg:text-base mb-1">
                                        {metric.label}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-400 text-xs md:text-sm leading-tight">
                                        {metric.description}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;
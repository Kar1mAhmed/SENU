'use client';
import React from 'react';
import Icon from '../../main/Icon';


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
            value: '700M+',
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
                <h2 className="font-new-black text-white text-4xl font-light sm:text-5xl md:text-6xl text-center mb-12">
                    Our <span className="font-medium">Impact</span>
                </h2>

                {/* Metrics Grid */}
                <div className="flex justify-center w-full px-4">
                    <div className="w-full max-w-[1000px] md:max-w-[1900px] lg:max-w-[1900px] xl:max-w-[1980px]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                            {metrics.map((metric, index) => (
                                <div
                                    key={metric.id}
                                    className="bg-black border border-[#474747]/30 rounded-lg p-6 md:p-8 flex flex-col items-center text-center hover:border-[#474747]/60 transition-all duration-300"
                                >
                                    {/* Icon/Accent */}
                                    <div className={`w-12 h-12 md:w-16 md:h-16 ${colorVariations[index].bg} rounded-full mb-4 md:mb-6 flex items-center justify-center`}>
                                            <Icon
                                                src={icons[index]}
                                                colorClass={colorVariations[index].iconColor}
                                                className="w-[60%] h-[60%] min-w-[12px] min-h-[12px] max-w-[26px] max-h-[26px]"
                                            />
                                    </div>

                                    {/* Value */}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-2">
                                        {metric.value}
                                    </h3>

                                    {/* Label */}
                                    <p className="text-white font-medium text-sm md:text-base mb-1">
                                        {metric.label}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-400 text-xs md:text-sm">
                                        {metric.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;

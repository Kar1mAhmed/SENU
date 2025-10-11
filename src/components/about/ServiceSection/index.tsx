'use client';
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import ScaleIn from '@/components/animations/ScaleIn';

const ServiceSection = () => {
    console.log('🛠️ Service section rendering - showcasing our diverse talents!');

    const services = [
        {
            name: 'Youtube',
            desktop: { top: '32%', left: '13%' },
            tablet: { top: '7%', left: '22%' },
            mobile: { top: '0%', left: '8%' }
        },
        {
            name: 'Shorts',
            desktop: { top: '25%', left: '40%' },
            tablet: { top: '10%', left: '45%' },
            mobile: { top: '2%', right: '15%' }
        },
        {
            name: 'design',
            desktop: { top: '20%', right: '20%' },
            tablet: { top: '2%', right: '22%' },
            mobile: { top: '5%', right: '40%' }
        },
        {
            name: 'AI art',
            desktop: { top: '50%', left: '20%' },
            tablet: { top: '30%', left: '15%' },
            mobile: { top: '20%', left: '10%' }
        },
        {
            name: 'UI/UX',
            desktop: { top: '40%', left: '40%' },
            tablet: { top: '29%', left: '35%' },
            mobile: { top: '20%', right: '12%' }
        },
        {
            name: 'Motions',
            desktop: { top: '35%', right: '22%' },
            tablet: { top: '28%', right: '30%' },
            mobile: { top: '23%', left: '35%' }
        },
        {
            name: 'Prints',
            desktop: { top: '48%', right: '15%' },
            tablet: { top: '44%', right: '22%' },
            mobile: { top: '36%', right: '22%' }
        },
        {
            name: 'performance',
            desktop: { top: '55%', left: '40%' },
            tablet: { top: '50%', left: '35%' },
            mobile: { top: '40%', left: '20%'}
        },
        {
            name: 'Products',
            desktop: { top: '65%', left: '15%' },
            tablet: { top: '52%', left: '12%' },
            mobile: { bottom: '30%', left: '15%' }
        },
        {
            name: 'Branding',
            desktop: { bottom: '10%', left: '25%' },
            tablet: { bottom: '20%', left: '20%' },
            mobile: { bottom: '30%', right: '25%' }
        },
        {
            name: 'logos',
            desktop: { bottom: '20%', left: '50%'},
            tablet: { bottom: '25%', right: '35%' },
            mobile: { top: '35%', left: '0%' }
        }
    ];

    return (
        <section className="w-full px-4 lg:px-0 mt-24">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <FadeIn direction="left" duration={0.8}>
                        <div className="space-y-6 text-center lg:text-left ml-0 lg:ml-8">
                        <div className="space-y-2">
                            <h2 className="font-new-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#4d4d4d' }}>
                                SHOWCASING DIVERSITY
                            </h2>
                            <h3 className="font-new-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                                AND PROMOTING ARTISTS
                            </h3>
                        </div>

                        <p className="font-alexandria text-base sm:text-lg text-white/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Our community is made up of talented artists from around the world who share their passion for contemporary art. We seek to showcase the diversity of artistic expressions and provide a platform for emerging artists to promote their work. With a focus on collaboration and innovation, we strive to push the boundaries of creativity and inspire future generations of artists.
                        </p>

                            <div className="flex justify-center lg:justify-start">
                                <button className="bg-blue hover:bg-blue-40 text-white font-new-black font-bold px-8 py-3 rounded-full transition-colors duration-300">
                                    Join us
                                </button>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right Service Tags */}
                    <ScaleIn delay={0.3} duration={0.8}>
                        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] mt-0 lg:mt-0">
                        {services.map((service, index) => {
                            // Calculate distance from center for opacity effect
                            const centerDistance = Math.abs(index - services.length / 2) / (services.length / 2);
                            const opacity = 1 - (centerDistance * 0.4); // Darker as distance increases

                            return (
                                <div key={`${service.name}-${index}`}>
                                    {/* Mobile positioning */}
                                    <div
                                        className={`absolute md:hidden group cursor-pointer transition-all duration-300 hover:scale-110`}
                                        style={service.mobile}
                                    >
                                        <div
                                            className={`
                          px-4 py-2 rounded-full border-2 border-white/30 text-white
                          transition-all duration-300 
                          hover:border-yellow group-hover:text-yellow group-hover:scale-107
                        `}
                                            style={{
                                                borderColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
                                                color: `rgba(255, 255, 255, ${opacity})`
                                            }}
                                        >
                                            <span className="font-alexandria text-xs font-medium whitespace-nowrap">
                                                {service.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tablet positioning */}
                                    <div
                                        className={`absolute hidden md:block lg:hidden group cursor-pointer transition-all duration-300 hover:scale-110`}
                                        style={service.tablet}
                                    >
                                        <div
                                            className={`
                          px-5 py-2.5 rounded-full border-2 border-white/30 text-white
                          transition-all duration-300 
                          hover:border-yellow group-hover:text-yellow group-hover:scale-107
                        `}
                                            style={{
                                                borderColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
                                                color: `rgba(255, 255, 255, ${opacity})`
                                            }}
                                        >
                                            <span className="font-alexandria text-sm font-medium whitespace-nowrap">
                                                {service.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Desktop positioning */}
                                    <div
                                        className={`absolute hidden lg:block group cursor-pointer transition-all duration-300 hover:scale-110`}
                                        style={service.desktop}
                                    >
                                        <div
                                            className={`
                          px-6 py-3 rounded-full border-2 border-yellow text-white
                          transition-all duration-300 
                          group-hover:border-yellow hover:border-yellow group-hover:scale-107
                        `}
                                            style={{
                                                borderColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
                                                color: `rgba(255, 255, 255, ${opacity})`
                                            }}
                                        >
                                            <span className="font-alexandria text-base font-medium whitespace-nowrap group-hover:text-yellow">
                                                {service.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </ScaleIn>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;

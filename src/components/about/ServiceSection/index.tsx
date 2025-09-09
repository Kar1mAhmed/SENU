'use client';
import React from 'react';

const ServiceSection = () => {
    console.log('🛠️ Service section rendering - showcasing our diverse talents!');

    const services = [
        { name: 'photography', position: { top: '32%', left: '13%' } },
        { name: 'Shorts', position: { top: '25%', left: '50%', transform: 'translateX(-50%)' } },
        { name: 'design', position: { top: '20%', right: '20%' } },
        { name: 'AI art', position: { top: '50%', left: '20%' } },
        { name: 'UI/UX', position: { top: '40%', left: '40%' } },
        { name: 'Motions', position: { top: '35%', right: '25%' } },
        { name: 'Prints', position: { top: '48%', right: '15%' } },
        { name: 'performance', position: { top: '55%', left: '50%', transform: 'translateX(-50%)' } },
        { name: 'Products', position: { top: '65%', left: '15%' } },
        { name: 'Branding', position: { bottom: '10%', left: '25%' } },
        { name: 'logos', position: { bottom: '20%', left: '50%', transform: 'translateX(-50%)' } },
        { name: 'AI art', position: { bottom: '30%', right: '20%' } }
    ];

    return (
        <section className="w-full px-4 lg:px-0 py-20">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="font-new-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#4d4d4d' }}>
                                SHOWCASING DIVERSITY
                            </h2>
                            <h3 className="font-new-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
                                AND PROMOTING ARTISTS
                            </h3>
                        </div>

                        <p className="font-alexandria text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
                            Our community is made up of talented artists from around the world who share their passion for contemporary art. We seek to showcase the diversity of artistic expressions and provide a platform for emerging artists to promote their work. With a focus on collaboration and innovation, we strive to push the boundaries of creativity and inspire future generations of artists.
                        </p>

                        <button className="bg-blue hover:bg-blue-40 text-white font-new-black font-bold px-8 py-3 rounded-full transition-colors duration-300">
                            Join us
                        </button>
                    </div>

                    {/* Right Service Tags */}
                    <div className="relative h-[500px] lg:h-[600px]">
                        {services.map((service, index) => {
                            // Calculate distance from center for opacity effect
                            const centerDistance = Math.abs(index - services.length / 2) / (services.length / 2);
                            const opacity = 1 - (centerDistance * 0.4); // Darker as distance increases

                            return (
                                <div
                                    key={`${service.name}-${index}`}
                                    className={`absolute group cursor-pointer transition-all duration-300 hover:scale-110 hover`}
                                    style={service.position}
                                >
                                    <div
                                        className={`
                      px-6 py-3 rounded-full border-2 border-white/30 text-white
                      transition-all duration-300 
                      group-hover:border-yellow group-hover:text-yellow
                    `}
                                        style={{
                                            borderColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
                                            color: `rgba(255, 255, 255, ${opacity})`
                                        }}
                                    >
                                        <span className="font-alexandria text-sm sm:text-base font-medium whitespace-nowrap">
                                            {service.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;

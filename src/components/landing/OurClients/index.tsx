'use client'
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';

const clientLogos = [
    { name: 'havana', src: '/images/clients/1.svg' },
    { name: 'oryx', src: '/images/clients/2.svg' },
    { name: 'Unicef', src: '/images/clients/12.svg' },
    { name: 'lego', src: '/images/clients/4.svg' },
    { name: 'tanoreen', src: '/images/clients/5.svg' },
    { name: 'havana', src: '/images/clients/6.svg' },
    { name: 'oryx', src: '/images/clients/7.svg' },
    { name: 'khazna', src: '/images/clients/8.svg' },
    { name: 'lego', src: '/images/clients/9.svg' },
];

const OurClients: React.FC = () => {
    // Create the content array: logos + "Join us now" + logos (repeated for smooth infinite scroll)
    const createScrollContent = () => {
        const content = [];
        
        // Add all logos
        clientLogos.forEach((logo, index) => {
            content.push({
                type: 'logo',
                key: `logo-${index}`,
                ...logo
            });
        });
        
        // Add "Join us now" text
        content.push({
            type: 'text',
            key: 'join-text',
            text: 'Add Yours'
        });
        
        return content;
    };

    const scrollContent = createScrollContent();
    
    // Duplicate the content for seamless infinite scroll
    const infiniteContent = [...scrollContent, ...scrollContent, ...scrollContent];

    return (
        <section className="py-16 md:py-20">
            <div className="flex justify-center w-full">
                <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                    <FadeIn direction="left" duration={0.8}>
                        <h2 className="text-4xl font-light ml-2 text-white sm:text-5xl md:text-6xl px-4 md:px-0">
                            Our
                            <br />
                            <span className="text-[#FAC53A] font-medium"> Clients </span>
                        </h2>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <div className="mt-8 relative w-full h-[90px] md:h-[142px] bg-glass-fill-clients backdrop-blur-md md:rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center">
                                {/* Smooth infinite scroll animation */}
                                <div 
                                    className="flex items-center animate-infinite-scroll"
                                    style={{
                                        animation: 'infiniteScroll 20s linear infinite',
                                    }}
                                >
                                    {infiniteContent.map((item: any, index: number) => (
                                        <div key={`${item.key}-${index}`} className="flex-shrink-0 mx-10 flex items-center justify-center">
                                            {item.type === 'logo' ? (
                                                <div className="w-24 h-24 flex items-center justify-center">
                                                    <img 
                                                        src={item.src} 
                                                        alt={item.name} 
                                                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110" 
                                                    />
                                                </div>
                                            ) : (
                                                <a href="/contact"  rel="noopener noreferrer">
                                                <div className="flex items-center justify-center px-8 py-4">
                                                    <span className="text-white font-new-black text-4xl md:text-6xl text-yellow cursor-pointer transition-transform duration-300 hover:scale-110 font-bold whitespace-nowrap bg-yellow bg-clip-text text-transparent">
                                                        {item.text}
                                                    </span>
                                                </div>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <style jsx>{`
                @keyframes infiniteScroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-${100 / 3}%);
                    }
                }
                
                .animate-infinite-scroll {
                    animation: infiniteScroll 45s linear infinite;
                }
                
                /* Pause animation on hover for better UX */
                .animate-infinite-scroll:hover {
                    animation-play-state: paused;
                }
                
                @media (max-width: 767px) {
                    .animate-infinite-scroll {
                        animation-duration: 25s;
                    }
                }
                
                @media (min-width: 768px) and (max-width: 1023px) {
                    .animate-infinite-scroll {
                        animation-duration: 35s;
                    }
                }
            `}</style>
        </section>
    );
};

export default OurClients;
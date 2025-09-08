import React from 'react';

const clientLogos = [
    { name: 'havana', src: '/images/clients/1.svg' },
    { name: 'oryx', src: '/images/clients/2.svg' },
    { name: 'khazna', src: '/images/clients/3.svg' },
    { name: 'lego', src: '/images/clients/4.svg' },
    { name: 'tanoreen', src: '/images/clients/5.svg' },
    { name: 'havana', src: '/images/clients/6.svg' },
    { name: 'oryx', src: '/images/clients/7.svg' },
    { name: 'khazna', src: '/images/clients/8.svg' },
    { name: 'lego', src: '/images/clients/9.svg' },
];

const OurClients: React.FC = () => {
    return (
        <section className="py-16 md:py-20">
            <div className="flex justify-center w-full ">
                <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                <h2 className="text-4xl font-light ml-2 text-white sm:text-5xl md:text-6xl px-4 md:px-0">
                    Our
                    <br />
                    <span className="text-[#FAC53A] font-medium"> Clients </span>
                </h2>
                <div className="mt-8 relative w-full h-[90px] md:h-[142px] bg-glass-fill-clients backdrop-blur-md md:rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                        <div className="flex animate-scroll-mobile md:animate-scroll-desktop">
                            {[...clientLogos, ...clientLogos].map((logo, index) => (
                                <div key={index} className="flex-shrink-0 mx-10 w-24 h-24 flex items-center justify-center">
                                    <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
};

export default OurClients;

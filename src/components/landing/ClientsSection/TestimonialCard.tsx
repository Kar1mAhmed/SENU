'use client';

import { Testimonial, WithClassName } from '@/lib/types';
import Image from 'next/image';

interface TestimonialCardProps extends WithClassName {
    testimonial: Testimonial;
    style?: React.CSSProperties;
}

export default function TestimonialCard({ testimonial, className = '', style }: TestimonialCardProps) {
    console.log('🎭 Rendering testimonial card for:', testimonial.name, 'with company:', testimonial.company);

    return (
        <div
            className={`relative overflow-hidden flex flex-col justify-between p-6 text-white flex-shrink-0 w-[286px] h-[276px] lg:w-[360px] lg:h-[348px] ${className}`}
            style={{ backgroundColor: testimonial.backgroundColor, ...style }}
        >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
                <Image
                    src={testimonial.backgroundImage}
                    alt=""
                    fill
                    className="object-cover"
                    onError={() => console.log('🚨 Background image failed to load for:', testimonial.name)}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Person Info */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                        <Image
                            src={testimonial.personImage}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={() => console.log('🚨 Person image failed to load for:', testimonial.name)}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-sm opacity-90">{testimonial.position}</p>
                        {/* <p className="text-xs opacity-75">{testimonial.company}</p> */}
                    </div>
                </div>

                {/* Testimonial Text */}
                <div className="flex-1 flex flex-col justify-center">
                    <p className="text-base leading-relaxed mb-6">
                        {testimonial.testimonial}
                    </p>
                </div>

                {/* Learn More Button */}
                <div className="flex justify-start">
                    <button className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
                        Learn more
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 12L10 8L6 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

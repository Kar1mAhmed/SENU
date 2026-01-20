'use client';
import React from 'react';
import Image from 'next/image';
import { ProjectSlide } from '@/lib/types';
import { keyToUrl } from '@/lib/media';

interface SingleImageSlideProps {
    slide: ProjectSlide;
    index: number;
}

const SingleImageSlide: React.FC<SingleImageSlideProps> = ({ slide, index }) => {
    if (!slide.mediaKey) return null;

    return (
        <div className="w-full block">
            <Image
                src={keyToUrl(slide.mediaKey) || ''}
                alt={slide.text || `Project slide ${index + 1}`}
                width={1920}
                height={1080}
                className="w-full h-auto object-contain block"
                priority={index < 3} // Prioritize first 3 images
                loading={index < 3 ? 'eager' : 'lazy'} // Load first 3 eagerly, rest lazily
                quality={95}
                unoptimized={false}
            // Error handling can be managed by the parent or within here if we want to hide it
            />
            {slide.text && (
                <div className="mt-4 text-center px-4">
                    <p className="text-gray-400 text-sm italic">{slide.text}</p>
                </div>
            )}
        </div>
    );
};

export default SingleImageSlide;

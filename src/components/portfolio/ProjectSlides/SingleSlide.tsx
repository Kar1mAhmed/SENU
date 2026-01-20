'use client';
import React from 'react';
import { ProjectSlide } from '@/lib/types';
import SingleHorizontalSlide from './SingleHorizontalSlide';
import SingleVerticalSlide from './SingleVerticalSlide';
import SingleImageSlide from './SingleImageSlide';

interface SingleSlideProps {
    slide: ProjectSlide;
    index: number;
}

const SingleSlide: React.FC<SingleSlideProps> = ({ slide, index }) => {
    switch (slide.type) {
        case 'horizontal':
            return <SingleHorizontalSlide slide={slide} />;
        case 'vertical':
            return <SingleVerticalSlide slide={slide} index={index} />;
        case 'image':
            return <SingleImageSlide slide={slide} index={index} />;
        default:
            return (
                <div className="text-center text-gray-400 py-8">
                    <p>Unsupported slide type: {slide.type}</p>
                </div>
            );
    }
};

export default SingleSlide;

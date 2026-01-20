'use client';
import React from 'react';
import { keyToUrl } from '@/lib/media';
import { ProjectSlide } from '@/lib/types';
import VideoPlayer from '@/components/main/VideoPlayer';

interface SingleHorizontalSlideProps {
    slide: ProjectSlide;
}

const SingleHorizontalSlide: React.FC<SingleHorizontalSlideProps> = ({ slide }) => {
    if (!slide.mediaKey) return null;

    return (
        <div className="w-full">
            {/* Video Player - Max height 80vh on large screens */}
            <div className="relative w-full aspect-video lg:max-h-[80vh]">
                <VideoPlayer
                    videoUrl={keyToUrl(slide.mediaKey) || ''}
                    projectType="horizontal"
                    className="w-full h-full"
                    lazyLoad={true}
                    autoGeneratePoster={false}
                />
            </div>

            {/* Optional Text Below Video */}
            {slide.text && (
                <div className="mt-6 text-center">
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {slide.text}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SingleHorizontalSlide;

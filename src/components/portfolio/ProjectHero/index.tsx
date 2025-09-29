'use client';
import React from 'react';
import Image from 'next/image';
import { Project } from '@/lib/types';

interface ProjectHeroProps {
  project: Project;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  console.log('🦸 ProjectHero rendering for:', project.name);

  return (
    <section className="w-full px-4 lg:px-0 py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Desktop Layout: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left Part - Project Info */}
          <div className="order-2 lg:order-1">
            {/* Logo and Title */}
            <div className="flex items-center gap-6 mb-8">
              {/* Client Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                {project.clientLogo ? (
                  <Image
                    src={project.clientLogo}
                    alt={`${project.client} logo`}
                    width={96}
                    height={96}
                    className="w-full h-full rounded-lg overflow-hidden"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-lg md:text-xl">
                      {project.client.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Title */}
              <div className="flex-1">
                <h1 className="font-alexandria text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white">
                  {project.name}
                </h1>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {/* Category Tag */}
                {/* <span className="px-6 w-auto h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap bg-[#474747]/20 border-[1px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] flex items-center">
                  {project.category}
                </span> */}

                {/* Work Tags */}
                {project.work.map((workItem, index) => (
                  <span
                    key={index}
                    className="px-6 w-auto h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap bg-[#474747]/20 border-[1px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] flex items-center"
                  >
                    {workItem}
                  </span>
                ))}

                {/* Project Type Tag */}
                {/* <span className="px-6 w-auto h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap bg-[#474747]/20 border-[1px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] flex items-center">
                  {project.type}
                </span> */}
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-400 text-base leading-relaxed">
              <p>{project.description}</p>
            </div>
          </div>

          {/* Right Part - Project Cover Image - Hidden on mobile */}
          <div className="order-1 lg:order-2 hidden lg:block">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Project Cover Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-xl">
                    <span className="text-gray-400 text-lg">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;

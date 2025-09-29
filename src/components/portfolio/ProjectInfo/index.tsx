'use client';
import React from 'react';
import { ProjectExtraField } from '@/lib/types';

export type ProjectInfoProps = {
  extraFields: ProjectExtraField[];
};

console.log('📋 ProjectInfo component loaded - ready to display project details like a professional portfolio!');

const ProjectInfo: React.FC<ProjectInfoProps> = ({ extraFields }) => {
  // Filter out empty fields and limit to 4 maximum
  const validFields = extraFields.filter(field => field.name && field.value).slice(0, 4);

  if (validFields.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* Project Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {validFields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-3">
                <div className="w-full h-[2px] bg-yellow-400 mb-2"></div>
                <h3 className="text-sm font-medium text-[#8E8E8E] uppercase tracking-wider">
                  {field.name}
                </h3>
                {/* Yellow underline */}
              </div>
              {/* Field Value */}
              {field.url ? (
                <a
                  href={field.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-xl lg:text-2xl font-semibold text-white font-alexandria font-thin hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                >
                  <span>{field.value}</span>
                  <svg 
                    className="w-5 h-5 lg:w-6 lg:h-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <p className="text-xl lg:text-2xl font-semibold text-white font-alexandria font-thin">
                  {field.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;

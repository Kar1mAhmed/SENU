'use client';
import React from 'react';

export type ProjectExtraField = {
  name: string;
  value: string;
};

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
    <section className="py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* Project Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {validFields.map((field, index) => (
            <div key={index} className="flex flex-col">
              {/* Field Name with Yellow Underline */}
              <div className="mb-3">
                <div className="w-full h-[2px] bg-yellow-400 mb-2"></div>

                <h3 className="text-sm font-medium text-[#8E8E8E] uppercase tracking-wider">
                  {field.name}
                </h3>
                {/* Yellow underline */}
              </div>
              {/* Field Value */}
              <p className="text-xl lg:text-2xl font-semibold text-white font-alexandria">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;

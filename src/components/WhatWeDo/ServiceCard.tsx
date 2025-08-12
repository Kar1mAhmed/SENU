"use client";
import React from 'react';
import type { Service, WithClassName } from '@/lib/types';

interface ServiceCardProps {
  service: Service;
}

import { FiArrowUpRight } from 'react-icons/fi';

const ServiceCard: React.FC<WithClassName<ServiceCardProps>> = ({ service, className }) => {
  const { title, description, imageSrc, projectsCount, accentColor } = service;

  const bigCount = projectsCount > 9 ? `${projectsCount}+` : projectsCount;

  return (
    <div className={`flex-shrink-0 group ${className}`} style={{ transform: 'translateZ(0)' }}>
      {/* Card shell */}
      <div
        className="relative w-full max-w-[280px] h-[260px] md:max-w-[360px] md:h-[315px] overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: accentColor }}
      >
        {/* Background media (transparent art) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full w-full p-5 flex flex-col text-white">
          {/* Top row: title text + arrow */}
          <div className="flex items-start justify-between">
            <span className="text-white/90 text-base font-normal capitalize">
              {title}
            </span>
            <FiArrowUpRight size={24} className="text-white/80" />
          </div>

          {/* Bottom: big 10+ and description */}
          <div className="mt-auto overflow-hidden">
            <div className="font-new-black font-extrabold text-[128px] leading-none">{bigCount}</div>
            <p className="mt-2 text-white/80 text-sm max-w-[85%]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

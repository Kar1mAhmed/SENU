'use client';
import React from 'react';

interface ViewProjectButtonProps {
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Pill-shaped "View →" button for navigating to project details
 * Styled with a dark background and white border, matching the design reference
 */
const ViewProjectButton: React.FC<ViewProjectButtonProps> = ({
    onClick,
    className = '',
    size = 'md'
}) => {
    // Size variants
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-xs gap-1.5',
        md: 'px-5 py-2 text-sm gap-2',
        lg: 'px-6 py-2.5 text-base gap-2.5'
    };

    const arrowSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <button
            onClick={onClick}
            className={`
        inline-flex items-center justify-center
        bg-black/80 backdrop-blur-sm
        border border-white/40 hover:border-white/80
        rounded-full
        text-white font-medium
        transition-all duration-300 ease-out
        hover:bg-black hover:scale-105
        cursor-pointer
        ${sizeClasses[size]}
        ${className}
      `}
        >
            <span>View</span>
            <svg
                className={`${arrowSizes[size]} transition-transform duration-300 group-hover:translate-x-0.5`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export default ViewProjectButton;

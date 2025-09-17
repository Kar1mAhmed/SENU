// src/components/main/CategoryFilter/index.tsx
'use client';
import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    activeCategory,
    onCategoryChange
}) => {
    console.log('🏷️ CategoryFilter rendered with active:', activeCategory);

    return (
        <div className="flex justify-center mb-16">
            <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 no-scrollbar px-4" id="category-buttons">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-6 w-[143px] h-[39px] py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                            activeCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-[#474747]/20 border-[2px] border-[#474747]/80 bg-opacity-50 text-[#8E8E8E] hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
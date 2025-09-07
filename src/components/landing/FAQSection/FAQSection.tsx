'use client';

import React, { useState } from 'react';
import { FAQ, WithClassName } from '@/lib/types';
import { mockFAQs } from '@/lib/mock-data';

interface FAQItemProps {
    faq: FAQ;
    isOpen: boolean;
    onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle }) => {
    console.log('🤔 FAQ item rendered:', faq.question.substring(0, 50) + '...');

    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full py-6 px-0 text-left flex justify-between items-center transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-medium text-white pr-4 new-black font-bold">
                    {faq.question}
                </h3>
                <div className="flex-shrink-0">
                    <svg
                        className={`w-6 h-6 text-white transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </div>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="pb-6 pr-10">
                    <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

interface FAQSectionProps extends WithClassName {
    faqs?: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({
    className = '',
    faqs = mockFAQs
}) => {
    const [openFAQ, setOpenFAQ] = useState<string | null>(faqs[0]?.id || null);

    console.log('📋 FAQ Section rendered with', faqs.length, 'questions');

    const handleToggle = (faqId: string) => {
        console.log('🔄 Toggling FAQ:', faqId, 'currently open:', openFAQ);
        setOpenFAQ(openFAQ === faqId ? null : faqId);
    };

    return (
        <section className={`py-20 md:py-24 ${className}`}>
            {/* Header Section - Full Width like Navbar */}
            <div className="flex justify-center w-full px-4 mb-16">
                <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
                        {/* Left: Title and Description */}
                        <div>
                            <h2 className="mx-4 lg:mx-0 text-4xl lg:text-5xl font-semibold text-white mb-6 new-black">
                                Design FAQs
                            </h2>
                            <p className="mx-4 lg:mx-0 text-gray-400 text-sm md:text-lg leading-relaxed max-w-lg font-alexandria">
                                As a leading Design agency, we are dedicated to providing
                                comprehensive educational resources and answering frequently
                                asked questions to help our clients.
                            </p>
                        </div>

                        {/* Right: Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 md:flex-shrink-0">
                            <button className="mx-4 lg:mx-0 border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 gap-2">
                                More Questions
                            </button>
                            <button className="mx-4 lg:mx-0 bg-blue hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105  hover:shadow-lg hover:shadow-blue-600/25">
                                Get In touch
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Items Section */}
            <div className="flex justify-center w-full px-4">
                <div className="w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px]">
                    <div className="bg-glass-fill-clients backdrop-blur-md p-8 backdrop-blur-sm">
                        <div className="space-y-0">
                            {faqs.map((faq) => (
                                <FAQItem
                                    key={faq.id}
                                    faq={faq}
                                    isOpen={openFAQ === faq.id}
                                    onToggle={() => handleToggle(faq.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;

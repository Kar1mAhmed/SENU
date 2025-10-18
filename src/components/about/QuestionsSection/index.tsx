'use client';
import React from 'react';
import QuestionCard from './QuestionCard';
import { mockAboutCards } from '@/lib/mock-data';
import ScrollStack from '@/components/animations/ScrollStack';

const QuestionsSection = () => {
    console.log('❓ Questions section loading - time to answer the burning questions!');

    return (
        <section className="w-full px-4 lg:px-0 mb-2">
            <div className="max-w-[1280px] lg:mx-auto mx-4">
                <div className="relative" style={{ minHeight: `${mockAboutCards.length * 600}px` }}>
                    {mockAboutCards.map((card, index) => (
                        <ScrollStack 
                            key={card.id} 
                            index={index}
                            totalCards={mockAboutCards.length}
                        >
                            <QuestionCard
                                card={card}
                                index={index}
                            />
                        </ScrollStack>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuestionsSection;

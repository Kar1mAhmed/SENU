'use client';
import React from 'react';
import QuestionCard from '../QuestionCard';
import { mockAboutCards } from '@/lib/mock-data';

const QuestionsSection = () => {
    console.log('❓ Questions section loading - time to answer the burning questions!');

    return (
        <section className="w-full px-4 lg:px-0 mb-20">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col gap-8">
                    {mockAboutCards.map((card, index) => (
                        <QuestionCard
                            key={card.id}
                            card={card}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuestionsSection;

'use client';
import React from 'react';
import QuestionCard from './QuestionCard';
import { mockAboutCards } from '@/lib/mock-data';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

const QuestionsSection = () => {
    console.log('❓ Questions section loading - time to answer the burning questions!');

    return (
        <section className="w-full px-4 lg:px-0 mb-2">
            <div className="max-w-[1280px] lg:mx-auto mx-4">
                <StaggerContainer staggerDelay={0.2} className="flex flex-col gap-8">
                    {mockAboutCards.map((card, index) => (
                        <StaggerItem key={card.id} direction="up">
                            <QuestionCard
                                card={card}
                                index={index}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
};

export default QuestionsSection;

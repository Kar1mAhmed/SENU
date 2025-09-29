// Project detail page with URL-friendly project names
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useProjectWithSlides } from '@/lib/hooks/useProjectWithSlides';
import { transformProjectForFrontend } from '@/lib/data-transform';
import ProjectHero from '@/components/portfolio/ProjectHero';
import ProjectInfo from '@/components/portfolio/ProjectInfo';
import Link from 'next/link';
import Navbar from '@/components/main/Navbar';

console.log('🎯 Project detail page loaded - ready to showcase projects like a digital gallery!');

const ProjectDetail: React.FC = () => {
    const params = useParams();
    const projectName = params.projectName as string;

    // Fetch project with slides and extra fields
    const { project: projectWithSlides, loading, error } = useProjectWithSlides(projectName);

    if (loading) {
        return (

            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                </div>
            </div>
        );
    }

    if (error || !projectWithSlides) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The requested project could not be found.'}</p>
                    <Link
                        href="/portfolio"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    // Convert ProjectWithSlides to Project format for ProjectHero component
    const project = transformProjectForFrontend(projectWithSlides);

    return (
        <>
        <Navbar />
        <div className="min-h-screen  text-white mt-32">
            {/* Hero Section */}
            <ProjectHero project={project} />

            {/* Project Information Section */}
            <ProjectInfo extraFields={projectWithSlides.extraFields} />

            {/* Slides Section - TODO: Implement */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8">Project Slides</h2>
                    <p className="text-gray-400">Slides section coming soon...</p>
                </div>
            </section>
        </div>
        </>
    );
};

export default ProjectDetail;

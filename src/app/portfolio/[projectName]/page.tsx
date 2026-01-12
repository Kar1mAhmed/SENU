// Project detail page with URL-friendly project names
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useProjectWithSlides } from '@/lib/hooks/useProjectWithSlides';
import { transformProjectForFrontend } from '@/lib/data-transform';
import ProjectHero from '@/components/portfolio/ProjectHero';
import ProjectInfo from '@/components/portfolio/ProjectInfo';
import ProjectSlides from '@/components/portfolio/ProjectSlides';
import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import SEOHead from '@/components/SEOHead';
import { siteConfig } from '@/lib/seo-config';
import { generateCreativeWorkSchema, generateBreadcrumbSchema } from '@/lib/metadata';

export const runtime = 'edge';


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

    // Generate dynamic OG image URL
    const ogImageParams = new URLSearchParams({
        name: project.name,
        client: project.client || '',
        category: project.category,
        description: project.description || `${project.name} - ${project.category} project by Senu`,
        logo: project.clientLogo || '',
    });
    const dynamicOgImage = `${siteConfig.url}/api/og?${ogImageParams.toString()}`;

    // Generate structured data
    const creativeWorkSchema = generateCreativeWorkSchema({
        name: project.name,
        description: project.description || `${project.name} - ${project.category} project by Senu`,
        thumbnailUrl: project.thumbnailUrl,
        category: project.category,
        client: project.client
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Portfolio', url: '/portfolio' },
        { name: project.name, url: `/portfolio/${projectName}` }
    ]);

    return (
        <>
        <SEOHead 
            title={`${project.name} - ${project.category} Project | Senu`}
            description={project.description || `${project.name} - ${project.category} project by Senu creative studio`}
            keywords={[project.category, project.type, 'creative project', project.client || ''].filter(Boolean)}
            ogImage={dynamicOgImage}
            canonicalUrl={`${siteConfig.url}/portfolio/${projectName}`}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Navbar hideOnSectionId="projectSlides" />
        <div className="min-h-screen  text-white mt-24">
            {/* Hero Section */}
            <ProjectHero project={project} />

            {/* Project Information Section */}
            <ProjectInfo extraFields={projectWithSlides.extraFields} />

            {/* Slides Section */}
            <ProjectSlides 
                slides={projectWithSlides.slides} 
                projectType={project.type} 
            />
        </div>
        <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]"/>
        <Footer />
        </>
    );
};

export default ProjectDetail;

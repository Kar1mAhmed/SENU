// Metadata generation utilities for SEO
import { Metadata } from 'next';
import { siteConfig } from './seo-config';

interface PageMetadataProps {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    noIndex?: boolean;
    keywords?: string[];
}

export function generateMetadata({
    title,
    description,
    image,
    path = '',
    noIndex = false,
    keywords = []
}: PageMetadataProps = {}): Metadata {
    const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
    const pageDescription = description || siteConfig.description;
    const pageImage = image || siteConfig.ogImage;
    const url = `${siteConfig.url}${path}`;
    const allKeywords = [...siteConfig.keywords, ...keywords];

    return {
        title: {
            default: pageTitle,
            template: `%s | ${siteConfig.name}`,
        },
        description: pageDescription,
        keywords: allKeywords.join(', '),
        authors: [{ name: siteConfig.author, url: siteConfig.url }],
        creator: siteConfig.author,
        publisher: siteConfig.name,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: url,
            languages: {
                'en-US': url,
                // Add more languages if needed
                // 'ar-EG': `${url}?lang=ar`,
            },
        },
        openGraph: {
            type: 'website',
            locale: siteConfig.locale,
            alternateLocale: siteConfig.alternateLocales,
            url: url,
            title: pageTitle,
            description: pageDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: pageImage,
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@SenuStudio',
            creator: '@SenuStudio',
            title: pageTitle,
            description: pageDescription,
            images: [pageImage],
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            nocache: false,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
            // bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
        },
        category: 'Creative Services',
        classification: 'Business',
        referrer: 'origin-when-cross-origin',
    };
}

// Generate JSON-LD structured data for Organization
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'CreativeWork'],
        name: siteConfig.name,
        alternateName: 'Senu Studio',
        url: siteConfig.url,
        logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.svg`,
            width: 250,
            height: 100,
        },
        image: `${siteConfig.url}${siteConfig.ogImage}`,
        description: siteConfig.description,
        slogan: 'Transforming Ideas into Visual Masterpieces',
        foundingDate: siteConfig.business.foundedYear.toString(),
        sameAs: [
            siteConfig.links.twitter,
            siteConfig.links.instagram,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English', 'Arabic'],
            areaServed: 'Worldwide',
        },
        areaServed: {
            '@type': 'Place',
            name: 'Worldwide',
        },
        knowsAbout: siteConfig.business.services,
        makesOffer: siteConfig.business.services.map(service => ({
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: service,
                provider: {
                    '@type': 'Organization',
                    name: siteConfig.name,
                },
            },
        })),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '50', // Update with real data
            bestRating: '5',
            worstRating: '1',
        },
    };
}

// Generate JSON-LD structured data for Services
export function generateServiceSchema() {
    return siteConfig.services.map((service) => ({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.name,
        provider: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
        },
        description: service.description,
        areaServed: 'Worldwide',
    }));
}

// Generate JSON-LD for Creative Work (Projects)
export function generateCreativeWorkSchema(project: {
    name: string;
    description: string;
    thumbnailUrl: string;
    category: string;
    client?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        image: project.thumbnailUrl,
        creator: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
        },
        about: project.category,
        ...(project.client && {
            sponsor: {
                '@type': 'Organization',
                name: project.client,
            },
        }),
    };
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    };
}

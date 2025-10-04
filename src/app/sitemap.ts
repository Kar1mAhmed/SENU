// Dynamic sitemap generation
import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo-config';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/lib/types';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Get site URL from Cloudflare environment or fallback
    let baseUrl = siteConfig.url;
    try {
        const env = getRequestContext().env as CloudflareEnv;
        if (env.NEXT_PUBLIC_SITE_URL) {
            baseUrl = env.NEXT_PUBLIC_SITE_URL;
        }
    } catch {
        // Fallback to config if context not available
    }

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Fetch all projects for dynamic routes
    let projectPages: MetadataRoute.Sitemap = [];

    try {
        // In production, fetch from your API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || baseUrl;
        const response = await fetch(`${apiUrl}/api/projects?limit=100`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (response.ok) {
            const data = await response.json();

            // Handle paginated response structure
            const projects = data.success && data.data?.items
                ? data.data.items
                : Array.isArray(data)
                    ? data
                    : [];

            if (Array.isArray(projects)) {
                projectPages = projects.map((project: any) => {
                    // Convert project name to URL-friendly format
                    const projectSlug = project.name.toLowerCase().replace(/\s+/g, '-');

                    return {
                        url: `${baseUrl}/portfolio/${projectSlug}`,
                        lastModified: project.updated_at || project.updatedAt ? new Date(project.updated_at || project.updatedAt) : new Date(),
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                    };
                });
            }
        }
    } catch (error) {
        console.error('Error fetching projects for sitemap:', error);
        // Return static pages only if project fetch fails
    }

    return [...staticPages, ...projectPages];
}

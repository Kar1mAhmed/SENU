// Robots.txt configuration
import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Baiduspider', // Baidu (Chinese search engine)
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'YandexBot', // Yandex (Russian search engine)
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'facebot', // Facebook crawler
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Twitterbot', // Twitter crawler
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'LinkedInBot', // LinkedIn crawler
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      {
        userAgent: 'Pinterestbot', // Pinterest crawler
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      // Block SEO tool crawlers (waste resources)
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'MegaIndex',
          'SeznamBot',
        ],
        disallow: '/',
      },
      // Block aggressive/malicious crawlers
      {
        userAgent: [
          'PetalBot',
          'Bytespider',
          'Barkrowler',
          'BUbiNG',
          'Cliqzbot',
          'Exabot',
          'Gigabot',
          'ZoominfoBot',
          'AspiegelBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

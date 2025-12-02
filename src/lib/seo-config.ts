// SEO Configuration for SENU Creative Studio
// Gets site URL from Cloudflare environment variables (wrangler.jsonc)
export const getSiteUrl = () => {
    // In edge runtime, get from Cloudflare env
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    return 'https://senu.studio';
};

export const siteConfig = {
    name: 'SENU',
    title: 'SENU - Creative Design Studio | Video Editing, Motion Graphics & 3D modeling',
    description: 'Award-winning creative design studio crafting stunning video content, motion graphics, 3D modeling, and graphic design. From viral social media shorts to cinematic ads - we bring your vision to life with our expert creative team.',
    url: getSiteUrl(),
    ogImage: '/images/og-image.jpg',
    links: {
        twitter: 'https://twitter.com/SenuStudio',
        instagram: 'https://instagram.com/SenuStudio',
    },
    keywords: [
        // Core Services
        'video editing services',
        'professional video editing',
        'motion graphics design',
        'motion graphics studio',
        '3D animation services',
        '3D animation studio',
        'graphic design agency',
        'creative design studio',
        
        // Video Content
        'video production company',
        'video editing agency',
        'commercial video editing',
        'corporate video production',
        'explainer video production',
        'promotional video editing',
        
        // Social Media
        'social media content creation',
        'instagram reels editing',
        'tiktok video editing',
        'youtube shorts editing',
        'social media video production',
        'viral video editing',
        'short form content creation',
        
        // Motion & Animation
        'motion design studio',
        'motion graphics animation',
        'animated explainer videos',
        '2D animation services',
        '3D product animation',
        'logo animation',
        'kinetic typography',
        
        // Advertising
        'advertising video production',
        'commercial ad creation',
        'digital advertising design',
        'social media ads',
        'video ads production',
        'creative advertising agency',
        
        // Branding & Design
        'brand video production',
        'brand identity design',
        'visual branding',
        'creative branding agency',
        'logo design services',
        'UI/UX design',
        
        // Industry Terms
        'post-production services',
        'video post-production',
        'color grading services',
        'video color correction',
        'visual effects studio',
        'VFX services',
        
        // Creative Studio
        'creative content studio',
        'digital content creation',
        'multimedia production',
        'creative video agency',
        'boutique creative studio',
        'full-service creative agency'
    ],
    
    // Additional SEO metadata
    author: 'SENU Creative Studio',
    locale: 'en_US',
    alternateLocales: ['ar_EG'], // If you serve Arabic content
    
    // Business Information
    business: {
        type: 'Creative Agency',
        foundedYear: 2020, // Update with your actual founding year
        services: [
            'Video Editing',
            'Motion Graphics',
            '3D Animation',
            'Graphic Design',
            'Social Media Content',
            'Advertising Design'
        ],
        specialties: [
            'Short-form content (Reels, Shorts, TikTok)',
            'Commercial video production',
            'Brand storytelling',
            'Animated explainers',
            'Product visualization'
        ]
    },
    services: [
        {
            name: 'Video Editing',
            description: 'Professional video editing services for commercials, social media, and brand content. From raw footage to polished masterpieces.',
            keywords: ['video editing', 'commercial editing', 'corporate video', 'promotional video']
        },
        {
            name: 'Motion Graphics',
            description: 'Dynamic motion graphics and animation for engaging visual storytelling. Bring static designs to life with fluid animations.',
            keywords: ['motion graphics', 'motion design', 'animated graphics', 'kinetic typography']
        },
        {
            name: 'Graphic Design',
            description: 'Creative graphic design for branding, logos, UI/UX, and marketing materials. Visual identity that stands out.',
            keywords: ['graphic design', 'branding', 'logo design', 'UI/UX design']
        },
        {
            name: '3D Animation',
            description: 'High-quality 3D animation and modeling for products and visual effects. Photorealistic renders and stunning animations.',
            keywords: ['3D animation', '3D modeling', 'product visualization', 'VFX']
        },
        {
            name: 'Social Media Content',
            description: 'Eye-catching social media designs, reels, and shorts for maximum engagement. Viral-worthy content for Instagram, TikTok, and YouTube.',
            keywords: ['social media content', 'reels editing', 'shorts', 'tiktok videos', 'viral content']
        },
        {
            name: 'Advertising Design',
            description: 'Compelling ad designs for digital and print campaigns. Creative advertising that converts viewers into customers.',
            keywords: ['advertising design', 'digital ads', 'social media ads', 'commercial production']
        }
    ]
};

export type SiteConfig = typeof siteConfig;

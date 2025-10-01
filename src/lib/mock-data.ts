import { Project, Testimonial, FAQ, AboutCard, Service, TeamMember } from './types';



export const mockTestimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Job Ghadzi',
        position: 'Co-Founder',
        company: 'Co-Founder Agency',
        testimonial: 'The material is really updated, so I don\'t think I need to go to anywhere else for learning.',
        personImage: '/images/head/1.jpg',
        backgroundImage: '/images/clients/1.svg',
        backgroundColor: '#0055D1' // Brand blue
    },
    {
        id: '2',
        name: 'James Son',
        position: 'Senior Entrepreneur',
        company: 'Senior Entrepreneur',
        testimonial: 'Very different from conventional learning, this one is easier, should be more like this.',
        personImage: '/images/head/2.jpg',
        backgroundImage: '/images/clients/2.svg',
        backgroundColor: '#C13C1B' // Brand orange
    },
    {
        id: '3',
        name: 'James Son',
        position: 'Senior Entrepreneur',
        company: 'Senior Entrepreneur',
        testimonial: 'Again with like this it\'s not comfortable just learning via zoom at school.',
        personImage: '/images/head/3.jpg',
        backgroundImage: '/images/clients/3.svg',
        backgroundColor: '#4FAF78' // Brand green
    },
    {
        id: '4',
        name: 'James Son',
        position: 'Senior Entrepreneur',
        company: 'Senior Entrepreneur',
        testimonial: 'I think this is best team to work with, the took our project to the next level, ',
        personImage: '/images/head/4.jpg',
        backgroundImage: '/images/clients/4.svg',
        backgroundColor: '#8B5A9F' // Brand purple
    },
    {
        id: '5',
        name: 'James Son',
        position: 'Senior Entrepreneur',
        company: 'Senior Entrepreneur',
        testimonial: 'Again with like this it\'s not comfortable just learning via zoom at school.',
        personImage: '/images/head/5.jpg',
        backgroundImage: '/images/clients/5.svg',
        backgroundColor: '#EF4444' // Brand red
    }
];

export const mockFAQs: FAQ[] = [
    {
        id: '1',
        question: 'Why is Design important for my business?',
        answer: 'Design allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility. It provides measurable results, allows for targeted marketing efforts, and enables businesses to adapt and optimize their strategies based on data and insights.',
        imageUrl: '/images/covers/1.jpg',
        backgroundColor: 'bg-blue',
        character: 'W'
    },
    {
        id: '2',
        question: 'How can Design help improve my website\'s visibility?',
        answer: 'Design improves website visibility through strategic visual hierarchy, user-friendly navigation, responsive layouts, and compelling visual elements that enhance user experience and encourage longer site engagement.',
        imageUrl: '/images/covers/2.jpg',
        backgroundColor: 'bg-orange-50',
        character: 'H'
    },
    {
        id: '3',
        question: 'How long does it take to see results from Design efforts?',
        answer: 'Design results can be seen immediately in terms of user engagement and brand perception. However, measurable business impact typically becomes evident within 3-6 months of implementing a comprehensive design strategy.',
        imageUrl: '/images/covers/3.jpg',
        backgroundColor: 'bg-green',
        character: 'O'
    }
];



export const mockTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        position: 'Creative Director',
        description: 'Leading our creative vision with over 8 years of experience in brand strategy and visual storytelling. Passionate about creating meaningful connections through design.',
        imageUrl: '/images/head/1.jpg',
        characters: ['A', 'L', 'E', 'X', 'J', 'O', 'H', 'N']
    },
    {
        id: '2',
        name: 'Sarah Chen',
        position: 'Senior Designer',
        description: 'Specializing in UI/UX design and motion graphics. Sarah brings innovative solutions to complex design challenges with her keen eye for detail.',
        imageUrl: '/images/head/2.jpg',
        characters: ['S', 'A', 'R', 'A', 'C', 'H', 'E', 'N']
    },
    {
        id: '3',
        name: 'Marcus Rivera',
        position: 'Brand Strategist',
        description: 'Expert in brand development and market positioning. Marcus helps clients discover their unique voice and translate it into compelling visual narratives.',
        imageUrl: '/images/head/3.jpg',
        characters: ['M', 'A', 'R', 'C', 'R', 'I', 'V', 'E']
    },
    {
        id: '4',
        name: 'Emma Thompson',
        position: 'Art Director',
        description: 'Creative powerhouse with expertise in photography direction and visual campaigns. Emma ensures every project tells a captivating story.',
        imageUrl: '/images/head/4.jpg',
        characters: ['E', 'M', 'M', 'A', "", 'T', 'H', 'O', 'M']
    }
];

export const mockAboutCards: AboutCard[] = [
    {
        id: '1',
        question: 'Who are we?',
        answer: 'We are a collective of passionate designers, artists, and creative minds who believe in the power of visual storytelling. Our diverse backgrounds in branding, digital design, and creative strategy allow us to bring unique perspectives to every project we undertake.',
        imageUrl: '/images/covers/1.jpg',
        cardBackgroundColor: 'bg-blue',
        sidebarBackgroundColor: 'bg-blue-soft',
        sidebarCharacterColor: 'bg-blue-40',
        characters: ['W', 'H', 'O'],
        gridOpacity: 0.4
    },
    {
        id: '2',
        question: 'How do we approach creative challenges?',
        answer: 'We keep it smart, fast, and fresh. Strategy first — we learn what makes your brand tick. Then design and editing take over — and visuals that speak louder than words. we deliver it where it matters most: TikTok, Insta, YouTube, or wherever your audience hangs out. We blend professional craft with youthful energy',
        imageUrl: '/images/covers/2.jpg',
        cardBackgroundColor: 'bg-orange-50',
        sidebarBackgroundColor: 'bg-red-50',
        sidebarCharacterColor: 'bg-orange-30',
        characters: ['H', 'O', 'W'],
        gridOpacity: 0.75
    },
    {
        id: '3',
        question: 'Why working with us?',
        answer: 'Because attention is the new currency. People don’t just want content, they want a vibe — something that makes them stop scrolling and actually feel. Our goal is to give brands that spark. We believe good visuals can turn a small idea into a big movement. That’s why we care about every frame, every color, every caption. Our mission isn’t just to make things look good; it’s to make them unforgettable.',
        imageUrl: '/images/covers/3.jpg',
        cardBackgroundColor: 'bg-green',
        sidebarBackgroundColor: 'bg-green-soft',
        sidebarCharacterColor: 'bg-green-40',
        characters: ['W', 'H', 'Y'],
        gridOpacity: 0.45
    }
];

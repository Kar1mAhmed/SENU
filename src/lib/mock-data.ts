import { Project, Testimonial, FAQ } from './types';

export const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Brand Suggestions',
        client: 'T3d',
        work: ['Branding', 'Logo design'],
        imageUrl: '/images/covers/2.jpg',
        category: 'Branding',
    },
    {
        id: '2',
        name: 'Corporate Identity',
        client: 'Stark Industries',
        work: ['Branding'],
        imageUrl: '/images/covers/1.jpg',
        category: 'Branding',
    },
    {
        id: '3',
        name: 'Logo System',
        client: 'Innovate Co',
        work: ['Logo design'],
        imageUrl: '/images/covers/4.jpg',
        category: 'Logo design',
    },
    {
        id: '4',
        name: 'Symbol Design',
        client: 'Symbolic Inc.',
        work: ['Logo design'],
        imageUrl: '/images/covers/3.jpg',
        category: 'Logo design',
    },
    {
        id: '5',
        name: 'Web App UI',
        client: 'Future Tech',
        work: ['UI/UX'],
        imageUrl: '/images/service-branding.jpg',
        category: 'UI/UX',
    },
    {
        id: '6',
        name: 'Mobile App UX',
        client: 'Appify',
        work: ['UI/UX'],
        imageUrl: '/images/service-branding.jpg',
        category: 'UI/UX',
    },
    {
        id: '7',
        name: 'Product Packaging',
        client: 'Eco Goods',
        work: ['Products'],
        imageUrl: '/images/service-branding.jpg',
        category: 'Products',
    },
    {
        id: '8',
        name: 'Gadget Design',
        client: 'Gadgetron',
        work: ['Products'],
        imageUrl: '/images/service-branding.jpg',
        category: 'Products',
    },
];

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
        answer: 'Design allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility. It provides measurable results, allows for targeted marketing efforts, and enables businesses to adapt and optimize their strategies based on data and insights.'
    },
    {
        id: '2',
        question: 'How can Design help improve my website\'s visibility?',
        answer: 'Design improves website visibility through strategic visual hierarchy, user-friendly navigation, responsive layouts, and compelling visual elements that enhance user experience and encourage longer site engagement.'
    },
    {
        id: '3',
        question: 'How long does it take to see results from Design efforts?',
        answer: 'Design results can be seen immediately in terms of user engagement and brand perception. However, measurable business impact typically becomes evident within 3-6 months of implementing a comprehensive design strategy.'
    },
    {
        id: '4',
        question: 'How do you measure the success of Design campaigns?',
        answer: 'We measure design success through various metrics including user engagement rates, conversion rates, brand recognition surveys, website analytics, customer feedback, and overall business growth indicators.'
    }
];
